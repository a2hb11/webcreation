'use server'

import { headers } from 'next/headers'
import { after } from 'next/server'
import { z } from 'zod'
import { getCategories, getPackagesForCategory, getPriceFactors, getCurrencies, TIERS } from '@/lib/data/public'
import { notifyNewInquiry } from '@/lib/notify'
import { estimateRange, type PriceFactor } from '@/lib/pricing/engine'
import { rateLimit } from '@/lib/security/rate-limit'
import { getClientIp, hashIp } from '@/lib/security/request'
import { verifyTurnstile } from '@/lib/security/turnstile'
import { createAdminClient } from '@/lib/supabase/server'

export type InquiryState =
  | { status: 'idle' }
  | { status: 'success'; id: string }
  | { status: 'error'; code: InquiryErrorCode; fields?: Record<string, string[]> }

export type InquiryErrorCode =
  | 'invalid'
  | 'contact_required'
  | 'captcha'
  | 'rate_limited'
  | 'server'

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(80)

const schema = z.object({
  source: z.enum(['contact', 'quote', 'calculator']),
  locale: z.enum(['en', 'ar']),
  name: z.string().trim().min(1).max(120),
  email: z.union([z.literal(''), z.email().max(254)]).transform((v) => v || null),
  phone: z
    .string()
    .trim()
    .max(32)
    .regex(/^[+\d][\d\s()-]{5,31}$|^$/)
    .transform((v) => v || null),
  company: z.string().trim().max(120).transform((v) => v || null),
  message: z.string().trim().min(1).max(4000),
  categorySlug: z.union([z.literal(''), slug]).transform((v) => v || null),
  tier: z.union([z.literal(''), z.enum(TIERS)]).transform((v) => v || null),
  currency: z.union([z.literal(''), z.string().regex(/^[A-Z]{3}$/)]).transform((v) => v || null),
  calculator: z
    .string()
    .max(4000)
    .optional()
    .transform((raw, ctx) => {
      if (!raw) return null
      try {
        return calculatorSchema.parse(JSON.parse(raw))
      } catch {
        ctx.addIssue({ code: 'custom', message: 'invalid calculator payload' })
        return z.NEVER
      }
    }),
  // Honeypot: real users never see or fill this.
  website: z.string().max(0),
  turnstileToken: z.string().max(2048).optional(),
})

const calculatorSchema = z
  .array(z.object({ slug, units: z.number().int().min(0).max(1000).optional() }))
  .max(30)

const field = (formData: FormData, key: string) => {
  const value = formData.get(key)
  return typeof value === 'string' ? value : ''
}

export async function submitInquiry(_prev: InquiryState, formData: FormData): Promise<InquiryState> {
  const parsed = schema.safeParse({
    source: field(formData, 'source'),
    locale: field(formData, 'locale'),
    name: field(formData, 'name'),
    email: field(formData, 'email'),
    phone: field(formData, 'phone'),
    company: field(formData, 'company'),
    message: field(formData, 'message'),
    categorySlug: field(formData, 'categorySlug'),
    tier: field(formData, 'tier'),
    currency: field(formData, 'currency'),
    calculator: field(formData, 'calculator') || undefined,
    website: field(formData, 'website'),
    turnstileToken: field(formData, 'cf-turnstile-response') || undefined,
  })
  if (!parsed.success) {
    return { status: 'error', code: 'invalid', fields: z.flattenError(parsed.error).fieldErrors }
  }
  const input = parsed.data
  if (!input.email && !input.phone) return { status: 'error', code: 'contact_required' }

  const requestHeaders = await headers()
  const ip = getClientIp(requestHeaders)

  const [perIp, perContact] = await Promise.all([
    rateLimit(`inquiry:ip:${ip}`, { limit: 5, windowSeconds: 3600 }),
    rateLimit(`inquiry:contact:${(input.email ?? input.phone ?? '').toLowerCase()}`, {
      limit: 3,
      windowSeconds: 3600,
    }),
  ])
  if (!perIp.ok || !perContact.ok) return { status: 'error', code: 'rate_limited' }

  const captcha = await verifyTurnstile(input.turnstileToken, ip)
  if (!captcha.ok) return { status: 'error', code: 'captcha' }

  // Resolve references and recompute any estimate server-side; nothing
  // price-related from the client is trusted.
  const [categories, currencies] = await Promise.all([getCategories(), getCurrencies()])
  const category = input.categorySlug
    ? (categories.find((c) => c.slug === input.categorySlug) ?? null)
    : null
  const currency = input.currency
    ? (currencies.find((c) => c.code === input.currency) ?? null)
    : null

  let estimate: { from: number; to: number } | null = null
  if (input.calculator && input.tier) {
    const [packages, factors] = await Promise.all([
      getPackagesForCategory(category?.id ?? null),
      getPriceFactors(),
    ])
    const pkg = packages.find((p) => p.tier === input.tier)
    if (pkg) {
      const usable: PriceFactor[] = factors
        .filter((f) => f.in_calculator)
        .map((f) => ({
          slug: f.slug,
          deltaFromKwd: Number(f.delta_from_kwd),
          deltaToKwd: Number(f.delta_to_kwd),
          pricingMode: f.pricing_mode as PriceFactor['pricingMode'],
          maxUnits: f.max_units,
        }))
      estimate = estimateRange(
        { from: Number(pkg.price_from_kwd), to: Number(pkg.price_to_kwd) },
        usable,
        input.calculator,
      )
    }
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('inquiries')
    .insert({
      source: input.source,
      locale: input.locale,
      name: input.name,
      email: input.email,
      phone: input.phone,
      company: input.company,
      message: input.message,
      category_id: category?.id ?? null,
      tier: input.tier,
      currency_code: currency?.code ?? null,
      estimate_from_kwd: estimate?.from ?? null,
      estimate_to_kwd: estimate?.to ?? null,
      calculator: input.calculator,
      ip_hash: await hashIp(ip),
      user_agent: requestHeaders.get('user-agent')?.slice(0, 512) ?? null,
    })
    .select('id, created_at')
    .single()

  if (error || !data) {
    console.error('[inquiry] insert failed:', error?.message)
    return { status: 'error', code: 'server' }
  }

  after(() =>
    notifyNewInquiry({
      id: data.id,
      source: input.source,
      locale: input.locale,
      name: input.name,
      email: input.email,
      phone: input.phone,
      company: input.company,
      message: input.message,
      categoryName: category?.name_en ?? null,
      tier: input.tier,
      estimate: estimate ? { ...estimate, currency: 'KWD' } : null,
      createdAt: data.created_at,
    }),
  )

  return { status: 'success', id: data.id }
}
