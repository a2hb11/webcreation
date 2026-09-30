import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getCategories, getMaintenancePlans, getPackages, getPackagesForCategory, getPriceFactors, getPublicSettings, TIERS } from '@/lib/data/public'
import { getSelectedCurrency } from '@/lib/site/currency'
import { Arrow, ButtonLink, Chip, Container, Eyebrow, Section, SectionHeading } from '@/components/site/primitives'
import { PriceRangeText, toRange } from '@/components/site/price'
import { RevealGroup, RevealItem } from '@/components/site/reveal'
import { PackageCard } from '@/components/pricing/package-card'
import { Calculator } from '@/components/pricing/calculator'
import { Faq } from '@/components/home/faq'
import { CtaBand } from '@/components/home/cta-band'
import { convertFromKwd, formatMoney } from '@/lib/pricing/engine'

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ cat?: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'PricingPage' })
  return { title: t('title'), description: t('lead') }
}

export default async function PricingPage({ searchParams }: Props) {
  const [{ cat }, t, tc, locale, categories, allPackages, factors, plans, settings, { current }] = await Promise.all([
    searchParams, getTranslations('PricingPage'), getTranslations('Work.card'), getLocale(), getCategories(), getPackages(), getPriceFactors(), getMaintenancePlans(), getPublicSettings(), getSelectedCurrency(),
  ])
  const ar = locale === 'ar'
  const category = categories.find((c) => c.slug === cat) ?? null
  const packages = await getPackagesForCategory(category?.id ?? null)
  const whatsapp = typeof settings.whatsapp_number === 'string' ? settings.whatsapp_number : ''
  const tierNames = Object.fromEntries(TIERS.map((tr) => [tr, tc(`tier.${tr}`)]))
  const catById = new Map(categories.map((c) => [c.id, c.slug]))

  return (
    <>
      <Container className="pt-16 pb-12 md:pt-24">
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <h1 className="font-display mt-4 max-w-3xl text-display-lg font-semibold text-text-1">{t('title')}</h1>
        <p className="mt-5 max-w-2xl text-lg text-text-2">{t('lead')}</p>
      </Container>

      <Container>
        <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
          {[{ slug: '', label: t('typical') }, ...categories.map((c) => ({ slug: c.slug, label: ar ? c.name_ar : c.name_en }))].map((c) => (
            <Link key={c.slug} href={c.slug ? { pathname: '/pricing', query: { cat: c.slug } } : '/pricing'} scroll={false} className={`inline-flex h-9 shrink-0 items-center rounded-full border px-4 text-sm whitespace-nowrap transition-colors ${(cat ?? '') === c.slug ? 'border-gold-500/50 bg-gold-500/12 text-gold-300 light:text-gold-700' : 'border-border-1 bg-surface-1 text-text-2 hover:text-text-1'}`}>
              {c.label}
            </Link>
          ))}
        </div>
        <RevealGroup key={cat ?? 'all'} className="mt-8 grid gap-6 lg:grid-cols-3">
          {packages.map((p) => (
            <RevealItem key={p.id}>
              <PackageCard pkg={p} currency={current} categorySlug={category?.slug} />
            </RevealItem>
          ))}
        </RevealGroup>
        <p className="mt-6 text-sm text-text-3">{t('note')}</p>
      </Container>

      <Section band>
        <Container>
          <SectionHeading eyebrow={t('compareEyebrow')} title={t('compareTitle')} lead={t('compareLead')} />
          <div className="overflow-x-auto rounded-card border border-border-1">
            <table className="w-full text-sm">
              <thead className="bg-surface-1 text-start">
                <tr>
                  <th className="px-4 py-3 text-start font-medium text-text-3">{t('compare.row')}</th>
                  {TIERS.map((tr) => (
                    <th key={tr} className="px-4 py-3 text-start font-semibold text-text-1">{tierNames[tr]}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-1">
                {(['pages', 'design', 'languages', 'admin', 'payments', 'motion', 'seo', 'copy', 'support', 'delivery'] as const).map((row) => (
                  <tr key={row} className="hover:bg-surface-1/60">
                    <td className="px-4 py-3 font-medium text-text-2">{t(`compare.${row}.label`)}</td>
                    {TIERS.map((tr) => (
                      <td key={tr} className="px-4 py-3 text-text-2">{t(`compare.${row}.${tr}`)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </Section>

      <Section id="factors">
        <Container>
          <SectionHeading eyebrow={t('factorsEyebrow')} title={t('factorsTitle')} lead={t('factorsLead')} />
          <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
            {factors.map((f) => (
              <RevealItem key={f.id} className="flex flex-col gap-3 rounded-card border border-border-1 bg-surface-1 p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-text-1">{ar ? f.name_ar : f.name_en}</h3>
                  <Chip tone="gold">
                    {f.pricing_mode === 'percent' ? <bdi dir="ltr">+{Number(f.delta_from_kwd)}–{Number(f.delta_to_kwd)}%</bdi> : <>+<PriceRangeText range={toRange(f.delta_from_kwd, f.delta_to_kwd)} currency={current} locale={locale} />{f.pricing_mode === 'per_unit' && <span className="text-text-3">/{ar ? f.unit_label_ar : f.unit_label_en}</span>}</>}
                  </Chip>
                </div>
                <p className="text-sm leading-relaxed text-text-2">{ar ? f.description_ar : f.description_en}</p>
                <p className="mt-auto text-xs text-text-3"><span className="text-gold-500">{t('example')}</span> {ar ? f.example_ar : f.example_en}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <Section band id="calculator">
        <Container>
          <SectionHeading eyebrow={t('calcEyebrow')} title={t('calcTitle')} lead={t('calcLead')} />
          <Calculator
            categories={categories.map((c) => ({ slug: c.slug, name: ar ? c.name_ar : c.name_en }))}
            packages={allPackages.map((p) => ({ categorySlug: p.category_id ? (catById.get(p.category_id) ?? null) : null, tier: p.tier, name: ar ? p.name_ar : p.name_en, from: Number(p.price_from_kwd), to: Number(p.price_to_kwd) }))}
            factors={factors.filter((f) => f.in_calculator).map((f) => ({ slug: f.slug, name: ar ? f.name_ar : f.name_en, description: ar ? f.description_ar : f.description_en, deltaFromKwd: Number(f.delta_from_kwd), deltaToKwd: Number(f.delta_to_kwd), pricingMode: f.pricing_mode as 'flat' | 'per_unit' | 'percent', maxUnits: f.max_units, unitLabel: ar ? f.unit_label_ar : f.unit_label_en }))}
            currency={current}
            locale={locale}
            whatsapp={whatsapp}
            tierNames={tierNames}
            labels={{ category: t('calc.category'), tier: t('calc.tier'), extras: t('calc.extras'), estimate: t('calc.estimate'), disclaimer: t('calc.disclaimer'), whatsapp: t('calc.whatsapp'), form: t('calc.form'), units: t('calc.units'), summary: t('calc.summary'), none: t('calc.none') }}
          />
        </Container>
      </Section>

      {plans.length > 0 && (
        <Section id="maintenance">
          <Container>
            <SectionHeading eyebrow={t('careEyebrow')} title={t('careTitle')} lead={t('careLead')} />
            <RevealGroup className="grid gap-6 lg:grid-cols-3">
              {plans.map((p) => (
                <RevealItem key={p.id} className={`flex flex-col rounded-card border p-7 ${p.highlighted ? 'border-gold-500/50 bg-surface-1' : 'border-border-1 bg-surface-1'}`}>
                  <h3 className="font-display text-2xl text-text-1">{ar ? p.name_ar : p.name_en}</h3>
                  <p className="mt-3 text-3xl text-text-1 tnum"><bdi dir="ltr">{formatMoney(convertFromKwd(Number(p.price_kwd_month), current), current, locale)}</bdi><span className="text-base text-text-3"> {t('perMonth')}</span></p>
                  <ul className="mt-5 flex flex-col gap-2 text-sm text-text-2">
                    {(Array.isArray(p.includes) ? (p.includes as { en?: string; ar?: string }[]) : []).map((b, i) => (
                      <li key={i} className="flex gap-2.5"><span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-gold-500" />{ar ? b.ar || b.en : b.en}</li>
                    ))}
                  </ul>
                  <ButtonLink href={{ pathname: '/contact', query: { plan: p.slug } }} variant="ghost" className="mt-8">
                    {t('carePick')}
                    <Arrow />
                  </ButtonLink>
                </RevealItem>
              ))}
            </RevealGroup>
          </Container>
        </Section>
      )}
      <Faq limit={9} />
      <CtaBand />
    </>
  )
}
