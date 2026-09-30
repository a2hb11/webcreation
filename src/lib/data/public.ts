import 'server-only'

import { unstable_cache } from 'next/cache'
import { createClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'
import type { Database } from '@/lib/supabase/database.types'

// Public, anonymous reads of published content. Results are cached in the
// Data Cache and tagged so admin writes can invalidate them instantly; the
// hourly revalidate is only a safety net.

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
export type Category = Tables<'categories'>
export type Project = Tables<'projects'>
export type ProjectImage = Tables<'project_images'>
export type Package = Tables<'packages'>
export type PriceFactorRow = Tables<'price_factors'>
export type MaintenancePlan = Tables<'maintenance_plans'>
export type Currency = Tables<'currencies'>
export type Faq = Tables<'faqs'>
export type Testimonial = Tables<'testimonials'>
export type Tier = Database['public']['Enums']['tier']

export const TIERS = ['starter', 'professional', 'elite'] as const satisfies readonly Tier[]

export const cacheTags = {
  categories: 'categories',
  projects: 'projects',
  packages: 'packages',
  factors: 'price_factors',
  maintenance: 'maintenance_plans',
  currencies: 'currencies',
  faqs: 'faqs',
  testimonials: 'testimonials',
  settings: 'site_settings',
} as const

const REVALIDATE_SECONDS = 3600

// Anonymous client: publishable key, no cookies, RLS applies. Safe to reuse
// inside cached functions because it carries no per-request state.
function anon() {
  return createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
}

// Reads are cached and, if the database is unreachable, fall back to an
// empty result so the marketing site still renders (with a logged error)
// instead of failing the whole page. Failures are not cached.
function cached<Args extends unknown[], R>(
  key: string,
  tags: string[],
  fn: (...args: Args) => Promise<R>,
  fallback: R,
) {
  const inner = unstable_cache(fn, [key], { tags, revalidate: REVALIDATE_SECONDS })
  return async (...args: Args): Promise<R> => {
    try {
      return await inner(...args)
    } catch (error) {
      console.error(`[data] ${key} failed:`, error instanceof Error ? error.message : error)
      return fallback
    }
  }
}

export const getCategories = cached('categories', [cacheTags.categories], async () => {
  const { data, error } = await anon()
    .from('categories')
    .select('*')
    .eq('published', true)
    .order('sort_order')
  if (error) throw error
  return data satisfies Category[]
}, [] as Category[])

export type ProjectCard = Project & { category: Pick<Category, 'slug' | 'name_en' | 'name_ar'> }

export const getProjects = cached(
  'projects',
  [cacheTags.projects, cacheTags.categories],
  async () => {
    const { data, error } = await anon()
      .from('projects')
      .select('*, category:categories!inner(slug, name_en, name_ar)')
      .eq('published', true)
      .order('sort_order')
    if (error) throw error
    return data as ProjectCard[]
  },
  [] as ProjectCard[],
)

export const getFeaturedProjects = cached(
  'projects:featured',
  [cacheTags.projects, cacheTags.categories],
  async () => {
    const { data, error } = await anon()
      .from('projects')
      .select('*, category:categories!inner(slug, name_en, name_ar)')
      .eq('published', true)
      .eq('featured', true)
      .order('sort_order')
      .limit(6)
    if (error) throw error
    return data as ProjectCard[]
  },
  [] as ProjectCard[],
)

export type ProjectDetail = ProjectCard & { images: ProjectImage[] }

export const getProjectBySlug = cached(
  'project',
  [cacheTags.projects, cacheTags.categories],
  async (slug: string) => {
    const { data, error } = await anon()
      .from('projects')
      .select('*, category:categories!inner(slug, name_en, name_ar), images:project_images(*)')
      .eq('published', true)
      .eq('slug', slug)
      .maybeSingle()
    if (error) throw error
    if (!data) return null
    const detail = data as ProjectDetail
    detail.images.sort((a, b) => a.sort_order - b.sort_order)
    return detail
  },
  null as ProjectDetail | null,
)

export const getPackages = cached('packages', [cacheTags.packages], async () => {
  const { data, error } = await anon()
    .from('packages')
    .select('*')
    .eq('published', true)
    .order('sort_order')
  if (error) throw error
  return data satisfies Package[]
}, [] as Package[])

/** Generic packages (no category) with per-category overrides applied. */
export async function getPackagesForCategory(categoryId: string | null) {
  const all = await getPackages()
  const generic = all.filter((p) => p.category_id === null)
  if (!categoryId) return sortByTier(generic)
  const specific = all.filter((p) => p.category_id === categoryId)
  const merged = TIERS.map(
    (tier) => specific.find((p) => p.tier === tier) ?? generic.find((p) => p.tier === tier),
  ).filter((p): p is Package => Boolean(p))
  return merged
}

function sortByTier(packages: Package[]) {
  return [...packages].sort((a, b) => TIERS.indexOf(a.tier) - TIERS.indexOf(b.tier))
}

export const getPriceFactors = cached('price_factors', [cacheTags.factors], async () => {
  const { data, error } = await anon()
    .from('price_factors')
    .select('*')
    .eq('published', true)
    .order('sort_order')
  if (error) throw error
  return data satisfies PriceFactorRow[]
}, [] as PriceFactorRow[])

export const getMaintenancePlans = cached('maintenance_plans', [cacheTags.maintenance], async () => {
  const { data, error } = await anon()
    .from('maintenance_plans')
    .select('*')
    .eq('published', true)
    .order('sort_order')
  if (error) throw error
  return data satisfies MaintenancePlan[]
}, [] as MaintenancePlan[])

export const getCurrencies = cached('currencies', [cacheTags.currencies], async () => {
  const { data, error } = await anon()
    .from('currencies')
    .select('*')
    .eq('enabled', true)
    .order('sort_order')
  if (error) throw error
  return data satisfies Currency[]
}, [] as Currency[])

export async function getDefaultCurrency() {
  const currencies = await getCurrencies()
  return currencies.find((c) => c.is_default) ?? currencies[0] ?? null
}

export const getFaqs = cached('faqs', [cacheTags.faqs], async () => {
  const { data, error } = await anon().from('faqs').select('*').eq('published', true).order('sort_order')
  if (error) throw error
  return data satisfies Faq[]
}, [] as Faq[])

export const getTestimonials = cached('testimonials', [cacheTags.testimonials], async () => {
  const { data, error } = await anon()
    .from('testimonials')
    .select('*')
    .eq('published', true)
    .order('sort_order')
  if (error) throw error
  return data satisfies Testimonial[]
}, [] as Testimonial[])

export type PublicSettings = Record<string, unknown>

export const getPublicSettings = cached('site_settings', [cacheTags.settings], async () => {
  const { data, error } = await anon().from('site_settings').select('key, value').eq('is_public', true)
  if (error) throw error
  return Object.fromEntries(data.map((row) => [row.key, row.value])) as PublicSettings
}, {} as PublicSettings)

export async function getSetting<T = string>(key: string, fallback: T): Promise<T> {
  const settings = await getPublicSettings()
  const value = settings[key]
  return (value === undefined || value === null ? fallback : value) as T
}
