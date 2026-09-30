import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getLocale, getTranslations } from 'next-intl/server'
import { getCategories, getProjects, TIERS } from '@/lib/data/public'
import { getSelectedCurrency } from '@/lib/site/currency'
import { Arrow, ButtonLink, Container, Eyebrow } from '@/components/site/primitives'
import { RevealGroup, RevealItem } from '@/components/site/reveal'
import { ProjectCard } from '@/components/work/project-card'
import { WorkFilters } from '@/components/work/filters'
import { CtaBand } from '@/components/home/cta-band'

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ cat?: string; tier?: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'WorkPage' })
  return { title: t('title'), description: t('lead') }
}

export default async function WorkPage({ searchParams }: Props) {
  const [{ cat, tier }, t, tc, locale, categories, projects, { current }] = await Promise.all([
    searchParams,
    getTranslations('WorkPage'),
    getTranslations('Work.card'),
    getLocale(),
    getCategories(),
    getProjects(),
    getSelectedCurrency(),
  ])
  const ar = locale === 'ar'
  const filtered = projects.filter((p) => (!cat || p.category.slug === cat) && (!tier || p.tier === tier))
  const countBy = (fn: (p: (typeof projects)[number]) => boolean) => projects.filter(fn).length

  return (
    <>
      <Container className="pt-16 pb-10 md:pt-24">
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <h1 className="font-display mt-4 max-w-3xl text-display-lg font-semibold text-text-1">{t('title')}</h1>
        <p className="mt-5 max-w-2xl text-lg text-text-2">{t('lead')}</p>
      </Container>
      <Container>
        <Suspense>
          <WorkFilters
            categories={categories.map((c) => ({ value: c.slug, label: ar ? c.name_ar : c.name_en, count: countBy((p) => p.category.slug === c.slug) }))}
            tiers={TIERS.map((tr) => ({ value: tr, label: tc(`tier.${tr}`), count: countBy((p) => p.tier === tr) }))}
            labels={{ all: t('all'), category: t('category'), tier: t('tier') }}
          />
        </Suspense>
        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-display text-3xl text-text-1">{t('emptyTitle')}</p>
            <p className="mt-3 text-text-2">{t('emptyLead')}</p>
            <div className="mt-8 flex justify-center">
              <ButtonLink href="/contact">
                {t('emptyCta')}
                <Arrow />
              </ButtonLink>
            </div>
          </div>
        ) : (
          <RevealGroup key={`${cat ?? ''}-${tier ?? ''}`} className="grid gap-6 py-10 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => (
              <RevealItem key={p.id} className={i === 0 && p.featured && !cat && !tier ? 'lg:col-span-2' : ''}>
                <ProjectCard project={p} currency={current} featured={i === 0 && p.featured && !cat && !tier} />
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </Container>
      <CtaBand />
    </>
  )
}
