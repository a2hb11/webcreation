import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getProjectBySlug, getProjects } from '@/lib/data/public'
import { getSelectedCurrency } from '@/lib/site/currency'
import { mediaUrl } from '@/components/site/media'
import { Arrow, ButtonLink, Chip, Container, Eyebrow } from '@/components/site/primitives'
import { PriceRangeText, toRange } from '@/components/site/price'
import { Reveal } from '@/components/site/reveal'
import { CtaBand } from '@/components/home/cta-band'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return {}
  const ar = locale === 'ar'
  return { title: ar ? project.title_ar : project.title_en, description: ar ? project.summary_ar : project.summary_en }
}

const paragraphs = (text: string) => text.split(/\n{2,}|\n/).map((p) => p.trim()).filter(Boolean)
const features = (v: unknown, ar: boolean) => (Array.isArray(v) ? (v as { en?: string; ar?: string }[]).map((x) => (ar ? x.ar || x.en : x.en) ?? '').filter(Boolean) : [])

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  if (!/^[a-z0-9-]{2,80}$/.test(slug)) notFound()
  const [project, all, t, tc, locale, { current }] = await Promise.all([getProjectBySlug(slug), getProjects(), getTranslations('ProjectPage'), getTranslations('Work.card'), getLocale(), getSelectedCurrency()])
  if (!project) notFound()
  const ar = locale === 'ar'
  const cover = mediaUrl(project.cover_path)
  const index = all.findIndex((p) => p.slug === slug)
  const prev = index > 0 ? all[index - 1] : null
  const next = index >= 0 && index < all.length - 1 ? all[index + 1] : null
  const demoHref = project.demo_route ? `/${locale}${project.demo_route}` : project.live_url

  return (
    <>
      <Container className="pt-16 md:pt-24">
        <Eyebrow>
          {ar ? project.category.name_ar : project.category.name_en} · {tc(`tier.${project.tier}`)}
        </Eyebrow>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-3xl">
            <h1 className="font-display text-display-lg font-semibold text-text-1">{ar ? project.title_ar : project.title_en}</h1>
            <p className="mt-5 text-lg text-text-2">{ar ? project.summary_ar : project.summary_en}</p>
          </div>
          <div className="flex flex-col items-start gap-3">
            {project.is_concept && <Chip tone="gold">{tc('concept')}</Chip>}
            <Chip className="text-base">
              <PriceRangeText range={toRange(project.price_from_kwd, project.price_to_kwd)} currency={current} locale={locale} />
            </Chip>
            {project.duration_days && <span className="text-sm text-text-3 tnum">{t('duration', { days: project.duration_days })}</span>}
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {demoHref && (
            <a href={demoHref} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 rounded-xl bg-btn-primary px-5 py-3 text-sm font-medium text-btn-primary-fg transition hover:bg-btn-primary-hover">
              {tc('openDemo')} <span aria-hidden className="rtl:-scale-x-100">↗</span>
            </a>
          )}
          <ButtonLink href={{ pathname: '/contact', query: { tier: project.tier, cat: project.category.slug } }} variant="ghost">
            {t('similar')}
            <Arrow />
          </ButtonLink>
        </div>
      </Container>

      <Container className="mt-12">
        <Reveal className="overflow-hidden rounded-card border border-border-1 bg-surface-1">
          <div className="flex h-7 items-center gap-1.5 border-b border-border-1 bg-surface-2 px-3" aria-hidden>
            <span className="size-1.5 rounded-full bg-text-4/40" />
            <span className="size-1.5 rounded-full bg-gold-500" />
            <span className="size-1.5 rounded-full bg-text-4/40" />
          </div>
          {cover ? (
            <div className="relative aspect-video">
              <Image src={cover} alt={ar ? project.title_ar : project.title_en} fill priority sizes="(min-width:1280px) 1216px, 100vw" className="object-cover object-top" />
            </div>
          ) : (
            <div className="grid aspect-video place-items-center bg-linear-to-br from-surface-1 via-surface-2 to-surface-3">
              <span className="font-display text-5xl text-text-3">{ar ? project.title_ar : project.title_en}</span>
            </div>
          )}
        </Reveal>
      </Container>

      <Container className="grid gap-16 py-20 lg:grid-cols-[1.2fr_0.8fr] md:py-28">
        <Reveal>
          <h2 className="font-display text-h2 font-semibold text-text-1">{t('story')}</h2>
          <div className="mt-6 flex flex-col gap-4 text-lg leading-relaxed text-text-2">
            {paragraphs(ar ? project.body_ar : project.body_en).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {project.tech_stack.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2">
              {project.tech_stack.map((tech) => (
                <Chip key={tech}>{tech}</Chip>
              ))}
            </div>
          )}
        </Reveal>
        <Reveal delay={0.1}>
          <div className="rounded-card border border-border-1 bg-surface-1 p-7">
            <h2 className="text-h3 font-semibold text-text-1">{t('included')}</h2>
            <ul className="mt-5 flex flex-col gap-3 text-text-2">
              {features(project.features, ar).map((f, i) => (
                <li key={i} className="flex gap-3">
                  <svg aria-hidden viewBox="0 0 16 16" className="mt-1 size-4 shrink-0 text-gold-500" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M3 8.5l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Container>

      {project.images.length > 0 && (
        <Container className="pb-20">
          <div className="grid gap-6 md:grid-cols-2">
            {project.images.map((img) => {
              const src = mediaUrl(img.path)
              return src ? (
                <Reveal key={img.id} className="relative aspect-[4/3] overflow-hidden rounded-card border border-border-1">
                  <Image src={src} alt={ar ? img.alt_ar : img.alt_en} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover object-top" />
                </Reveal>
              ) : null
            })}
          </div>
        </Container>
      )}

      {(prev || next) && (
        <Container className="flex justify-between gap-6 border-t border-border-1 py-10 text-sm">
          {prev ? (
            <Link href={`/work/${prev.slug}`} className="group inline-flex items-center gap-2 text-text-2 hover:text-gold-400">
              <Arrow className="rotate-180 rtl:rotate-180" /> {ar ? prev.title_ar : prev.title_en}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={`/work/${next.slug}`} className="group inline-flex items-center gap-2 text-text-2 hover:text-gold-400">
              {ar ? next.title_ar : next.title_en} <Arrow />
            </Link>
          )}
        </Container>
      )}
      <CtaBand />
    </>
  )
}
