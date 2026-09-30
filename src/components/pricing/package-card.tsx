import { getLocale, getTranslations } from 'next-intl/server'
import type { Package } from '@/lib/data/public'
import type { CurrencyRate } from '@/lib/pricing/engine'
import { Arrow, ButtonLink, Chip } from '@/components/site/primitives'
import { PriceRangeText, toRange } from '@/components/site/price'

const bullets = (v: unknown, ar: boolean) =>
  Array.isArray(v) ? (v as { en?: string; ar?: string }[]).map((x) => (ar ? x.ar || x.en : x.en) ?? '').filter(Boolean) : []

export async function PackageCard({ pkg, currency, categorySlug }: { pkg: Package; currency: CurrencyRate; categorySlug?: string }) {
  const [t, locale] = await Promise.all([getTranslations('Pricing.card'), getLocale()])
  const ar = locale === 'ar'
  return (
    <article className={`relative flex h-full flex-col rounded-card border p-7 ${pkg.highlighted ? 'border-gold-500/50 bg-surface-1 shadow-[0_0_0_1px_rgb(212_175_55/0.25),0_30px_80px_-40px_rgb(212_175_55/0.35)]' : 'border-border-1 bg-surface-1'}`}>
      {pkg.highlighted && (
        <div className="absolute -top-3 start-6">
          <Chip tone="gold">{t('mostChosen')}</Chip>
        </div>
      )}
      <p className="text-eyebrow font-semibold text-gold-500 uppercase rtl:normal-case">{t(`tier.${pkg.tier}`)}</p>
      <h3 className="font-display mt-2 text-3xl text-text-1">{ar ? pkg.name_ar : pkg.name_en}</h3>
      {(ar ? pkg.tagline_ar : pkg.tagline_en) && <p className="mt-1 text-sm text-text-3">{ar ? pkg.tagline_ar : pkg.tagline_en}</p>}
      <p className="mt-6 text-3xl font-medium text-text-1">
        <PriceRangeText range={toRange(pkg.price_from_kwd, pkg.price_to_kwd)} currency={currency} locale={locale} />
      </p>
      <p className="mt-1 text-sm text-text-3 tnum">{t('delivery', { min: pkg.delivery_days_min, max: pkg.delivery_days_max })}</p>
      <ul className="mt-6 flex flex-col gap-2.5 text-sm text-text-2">
        {bullets(pkg.includes, ar).map((b, i) => (
          <li key={i} className="flex gap-2.5">
            <svg aria-hidden viewBox="0 0 16 16" className="mt-0.5 size-4 shrink-0 text-gold-500" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M3 8.5l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {b}
          </li>
        ))}
      </ul>
      <div className="mt-8 pt-2">
        <ButtonLink href={{ pathname: '/contact', query: { tier: pkg.tier, ...(categorySlug ? { cat: categorySlug } : {}) } }} variant={pkg.highlighted ? 'primary' : 'ghost'} className="w-full">
          {t('quote')}
          <Arrow />
        </ButtonLink>
      </div>
    </article>
  )
}
