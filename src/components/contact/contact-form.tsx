'use client'

import { useActionState, useState } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import { submitInquiry, type InquiryState } from '@/app/actions/inquiry'
import { Arrow, Button } from '@/components/site/primitives'

type Option = { value: string; label: string }
type Labels = Record<'name' | 'company' | 'phone' | 'email' | 'category' | 'tier' | 'message' | 'submit' | 'sending' | 'successTitle' | 'successBody' | 'contactRequired' | 'invalid' | 'captcha' | 'rateLimited' | 'server' | 'none' | 'messagePlaceholder', string>

const field = 'w-full rounded-xl border border-border-1 bg-surface-1 px-4 py-3 text-sm text-text-1 outline-none transition-[border-color,box-shadow] duration-(--dur-fast) placeholder:text-text-4 focus:border-gold-500 focus:shadow-[0_0_0_2px_rgb(226_195_92/0.35)]'

export function ContactForm({ locale, categories, tiers, defaults, currency, turnstileSiteKey, labels }: { locale: string; categories: Option[]; tiers: Option[]; defaults: { category?: string; tier?: string; calc?: string; plan?: string }; currency: string; turnstileSiteKey?: string; labels: Labels }) {
  const [state, action, pending] = useActionState<InquiryState, FormData>(submitInquiry, { status: 'idle' })
  const [token, setToken] = useState<string | null>(null)
  const errors = state.status === 'error' ? state.fields : undefined
  const messageDefault = defaults.plan ? `${labels.messagePlaceholder} (${defaults.plan})` : ''

  if (state.status === 'success') {
    return (
      <div role="status" className="rounded-card border border-success/40 bg-success/10 p-8">
        <svg viewBox="0 0 48 48" className="size-12 text-success" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <circle cx="24" cy="24" r="22" className="opacity-40" />
          <path d="M14 25l7 7 13-15" strokeLinecap="round" strokeLinejoin="round" pathLength="1" className="[stroke-dasharray:1] [stroke-dashoffset:0] animate-[draw_0.6s_var(--ease-out-expo)]" />
        </svg>
        <h2 className="font-display mt-4 text-3xl text-text-1">{labels.successTitle}</h2>
        <p className="mt-2 text-text-2">{labels.successBody}</p>
      </div>
    )
  }

  const errorText = state.status === 'error' ? ({ invalid: labels.invalid, contact_required: labels.contactRequired, captcha: labels.captcha, rate_limited: labels.rateLimited, server: labels.server } as const)[state.code] : null

  return (
    <form action={action} className="flex flex-col gap-5" noValidate={false}>
      <input type="hidden" name="source" value={defaults.calc ? 'calculator' : 'quote'} />
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="currency" value={currency} />
      {defaults.calc && <input type="hidden" name="calculator" value={defaults.calc} />}
      {/* Honeypot: hidden from people, tempting to bots. */}
      <div className="absolute -start-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {errorText && (
        <p role="alert" className="rounded-xl border border-error/40 bg-error/10 px-4 py-3 text-sm text-text-1">
          {errorText}
        </p>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm text-text-2">
          {labels.name}
          <input name="name" required maxLength={120} autoComplete="name" className={field} aria-invalid={Boolean(errors?.name)} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-text-2">
          {labels.company}
          <input name="company" maxLength={120} autoComplete="organization" className={field} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-text-2">
          {labels.phone}
          <input name="phone" type="tel" inputMode="tel" dir="ltr" placeholder="+965" maxLength={32} autoComplete="tel" className={`${field} tnum`} aria-invalid={Boolean(errors?.phone)} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-text-2">
          {labels.email}
          <input name="email" type="email" dir="ltr" maxLength={254} autoComplete="email" className={field} aria-invalid={Boolean(errors?.email)} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-text-2">
          {labels.category}
          <select name="categorySlug" defaultValue={defaults.category ?? ''} className={field}>
            <option value="">{labels.none}</option>
            {categories.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-text-2">
          {labels.tier}
          <select name="tier" defaultValue={defaults.tier ?? ''} className={field}>
            <option value="">{labels.none}</option>
            {tiers.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="flex flex-col gap-1.5 text-sm text-text-2">
        {labels.message}
        <textarea name="message" required maxLength={4000} rows={5} dir="auto" defaultValue={messageDefault} className={field} aria-invalid={Boolean(errors?.message)} />
      </label>
      {turnstileSiteKey && <Turnstile siteKey={turnstileSiteKey} onSuccess={setToken} onExpire={() => setToken(null)} options={{ theme: 'auto', language: locale }} />}
      <div>
        <Button type="submit" disabled={pending || (Boolean(turnstileSiteKey) && !token)} className="w-full sm:w-auto">
          {pending ? labels.sending : labels.submit}
          <Arrow />
        </Button>
      </div>
    </form>
  )
}
