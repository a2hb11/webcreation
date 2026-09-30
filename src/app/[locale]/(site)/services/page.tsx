import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import { getCategories, getPackages, getProjects, TIERS } from '@/lib/data/public'
import { getSelectedCurrency } from '@/lib/site/currency'
import { Arrow, ButtonLink, Chip, Container, Eyebrow, Section } from '@/components/site/primitives'
import { PriceRangeText, toRange } from '@/components/site/price'
import { Reveal } from '@/components/site/reveal'
import { CategoryIcon } from '@/components/site/category-icon'
import { ProjectCard } from '@/components/work/project-card'
import { CtaBand } from '@/components/home/cta-band'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'ServicesPage' })
  return { title: t('title'), description: t('lead') }
}

const bullets = (v: unknown, ar: boolean) => (Array.isArray(v) ? (v as { en?: string; ar?: string }[]).map((x) => (ar ? x.ar || x.en : x.en) ?? '').filter(Boolean) : [])

export default async function ServicesPage() {
  const [t, tc, locale, categories, packages, projects, { current }] = await Promise.all([getTranslations('ServicesPage'), getTranslations('Work.card'), getLocale(), getCategories(), getPackages(), getProjects(), getSelectedCurrency()])
  const ar = locale === 'ar'
  const generic = packages.filter((p) => p.category_id === null)
  return (
    <>
      <Container className="pt-16 pb-8 md:pt-24">
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <h1 className="font-display mt-4 max-w-3xl text-display-lg font-semibold text-text-1">{t('title')}</h1>
        <p className="mt-5 max-w-2xl text-lg text-text-2">{t('lead')}</p>
        <nav className="mt-10 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]" aria-label={t('jump')}>
          {categories.map((c) => (
            <a key={c.id} href={`#${c.slug}`} className="inline-flex h-9 shrink-0 items-center rounded-full border border-border-1 bg-surface-1 px-4 text-sm whitespace-nowrap text-text-2 transition hover:text-text-1">
              {ar ? c.name_ar : c.name_en}
            </a>
          ))}
        </nav>
      </Container>
      {categories.map((c, i) => {
        const own = packages.filter((p) => p.category_id === c.id)
        const tiers = TIERS.map((tr) => own.find((p) => p.tier === tr) ?? generic.find((p) => p.tier === tr)).filter(Boolean)
        const starter = tiers[0]
        const elite = tiers[tiers.length - 1]
        const related = projects.filter((p) => p.category.slug === c.slug).slice(0, 2)
        return (
          <Section key={c.id} id={c.slug} band={i % 2 === 1} tight className="scroll-mt-20">
            <Container className="grid gap-12 lg:grid-cols-[1fr_1fr]">
              <Reveal>
                <CategoryIcon name={c.icon} className="size-8 text-gold-500" />
                <h2 className="font-display mt-5 text-h2 font-semibold text-text-1">{ar ? c.name_ar : c.name_en}</h2>
                <p className="mt-4 text-lg text-text-2">{ar ? c.description_ar : c.description_en}</p>
                {starter && elite && (
                  <p className="mt-6 flex flex-wrap items-center gap-3 text-sm text-text-3">
                    {t('typical')}
                    <Chip tone="gold" className="text-sm">
                      <PriceRangeText range={toRange(starter.price_from_kwd, elite.price_to_kwd)} currency={current} locale={locale} />
                    </Chip>
                  </p>
                )}
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {tiers.map((p) =>
                    p ? (
                      <div key={p.id} className="rounded-card border border-border-1 bg-surface-1 p-4">
                        <p className="text-eyebrow font-semibold text-gold-500 uppercase rtl:normal-case">{tc(`tier.${p.tier}`)}</p>
                        <p className="mt-2 text-sm font-medium text-text-1 tnum"><PriceRangeText range={toRange(p.price_from_kwd, p.price_to_kwd)} currency={current} locale={locale} /></p>
                        <ul className="mt-3 flex flex-col gap-1.5 text-xs text-text-3">
                          {bullets(p.includes, ar).slice(0, 3).map((b, j) => (
                            <li key={j}>· {b}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null,
                  )}
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <ButtonLink href={{ pathname: '/contact', query: { cat: c.slug } }}>
                    {t('cta')}
                    <Arrow />
                  </ButtonLink>
                  <ButtonLink href={{ pathname: '/pricing', query: { cat: c.slug } }} variant="ghost">
                    {t('pricing')}
                  </ButtonLink>
                </div>
              </Reveal>
              <div className="grid gap-6 self-start sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {related.map((p) => (
                  <Reveal key={p.id} delay={0.1}>
                    <ProjectCard project={p} currency={current} />
                  </Reveal>
                ))}
              </div>
            </Container>
          </Section>
        )
      })}
      <CtaBand />
    </>
  )
}
