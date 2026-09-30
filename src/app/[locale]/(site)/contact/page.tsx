import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import { getCategories, getPublicSettings, TIERS } from '@/lib/data/public'
import { getSelectedCurrency } from '@/lib/site/currency'
import { env } from '@/lib/env'
import { Container, Eyebrow } from '@/components/site/primitives'
import { HoursBadge } from '@/components/site/hours-badge'
import { ContactForm } from '@/components/contact/contact-form'
import { whatsappHref } from '@/lib/site/whatsapp'

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ cat?: string; tier?: string; calc?: string; plan?: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'ContactPage' })
  return { title: t('title'), description: t('lead') }
}

const pick = (v: unknown, locale: string) => (v && typeof v === 'object' ? String((v as Record<string, string>)[locale] ?? '') : typeof v === 'string' ? v : '')

export default async function ContactPage({ searchParams }: Props) {
  const [sp, t, tc, tf, locale, categories, settings, { current }] = await Promise.all([searchParams, getTranslations('ContactPage'), getTranslations('Work.card'), getTranslations('Footer'), getLocale(), getCategories(), getPublicSettings(), getSelectedCurrency()])
  const ar = locale === 'ar'
  const whatsapp = pick(settings.whatsapp_number, locale)
  const email = pick(settings.contact_email, locale)
  const instagram = pick(settings.instagram_handle, locale)
  const calc = sp.calc && sp.calc.length <= 4000 ? sp.calc : undefined
  const keys = ['name', 'company', 'phone', 'email', 'category', 'tier', 'message', 'submit', 'sending', 'successTitle', 'successBody', 'contactRequired', 'invalid', 'captcha', 'rateLimited', 'server', 'none', 'messagePlaceholder'] as const
  const labels = Object.fromEntries(keys.map((k) => [k, t(`form.${k}`)])) as Record<(typeof keys)[number], string>

  return (
    <Container className="grid gap-16 pt-16 pb-24 md:pt-24 lg:grid-cols-[1.2fr_0.8fr]">
      <div>
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <h1 className="font-display mt-4 text-display-lg font-semibold text-text-1">{t('title')}</h1>
        <p className="mt-5 max-w-xl text-lg text-text-2">{t('lead')}</p>
        <div className="relative mt-10">
          <ContactForm
            locale={locale}
            categories={categories.map((c) => ({ value: c.slug, label: ar ? c.name_ar : c.name_en }))}
            tiers={TIERS.map((tr) => ({ value: tr, label: tc(`tier.${tr}`) }))}
            defaults={{ category: sp.cat, tier: sp.tier, calc, plan: sp.plan }}
            currency={current.code}
            turnstileSiteKey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            labels={labels}
          />
        </div>
      </div>
      <aside className="flex flex-col gap-4 lg:pt-28">
        {whatsapp && (
          <a href={whatsappHref(whatsapp, tf('whatsappText'))} target="_blank" rel="noopener noreferrer" className="group rounded-card border border-border-1 bg-surface-1 p-6 transition hover:border-gold-500/40">
            <p className="text-eyebrow font-semibold text-gold-500 uppercase rtl:normal-case">{t('whatsappTitle')}</p>
            <p className="mt-2 text-2xl font-medium text-text-1 tnum" dir="ltr">{whatsapp}</p>
            <p className="mt-2 text-sm text-text-3">{t('whatsappBody')}</p>
          </a>
        )}
        <div className="rounded-card border border-border-1 bg-surface-1 p-6">
          <p className="text-eyebrow font-semibold text-gold-500 uppercase rtl:normal-case">{t('hoursTitle')}</p>
          <p className="mt-2 flex flex-wrap items-center gap-2 text-text-1">
            {pick(settings.hours, locale)} <HoursBadge openLabel={tf('openNow')} closedLabel={tf('closedNow')} />
          </p>
          <p className="mt-1 text-sm text-text-3">{pick(settings.location, locale)}</p>
        </div>
        {(email || instagram) && (
          <div className="rounded-card border border-border-1 bg-surface-1 p-6 text-sm">
            {email && <p><a href={`mailto:${email}`} className="text-text-2 hover:text-gold-400" dir="ltr">{email}</a></p>}
            {instagram && <p className="mt-2"><a href={`https://instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer" className="text-text-2 hover:text-gold-400" dir="ltr">@{instagram}</a></p>}
          </div>
        )}
        <p className="text-sm text-text-3">{t('terms')} {pick(settings.payment_terms, locale)}</p>
      </aside>
    </Container>
  )
}
