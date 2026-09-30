import Image from 'next/image'
import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { ProjectCard as ProjectCardData } from '@/lib/data/public'
import type { CurrencyRate } from '@/lib/pricing/engine'
import { mediaUrl } from '@/components/site/media'
import { Chip } from '@/components/site/primitives'
import { PriceRangeText, toRange } from '@/components/site/price'

export async function ProjectCard({ project, currency, featured = false }: { project: ProjectCardData; currency: CurrencyRate; featured?: boolean }) {
  const [t, locale] = await Promise.all([getTranslations('Work.card'), getLocale()])
  const ar = locale === 'ar'
  const cover = mediaUrl(project.cover_path)
  const demo = project.demo_route ?? project.live_url
  return (
    <article className={`group relative flex flex-col ${featured ? 'lg:col-span-2' : ''}`}>
      <Link href={`/work/${project.slug}`} className="absolute inset-0 z-10 rounded-card focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-400" aria-label={ar ? project.title_ar : project.title_en} />
      <div
        className={`relative overflow-hidden rounded-card border border-border-1 bg-surface-1 transition-[transform,border-color,box-shadow] duration-(--dur-moderate) ease-(--ease-out-quint) group-hover:scale-[1.015] group-hover:border-gold-500/45 group-hover:shadow-[0_0_0_1px_rgb(212_175_55/0.25),0_24px_60px_-24px_rgb(212_175_55/0.25)] ${featured ? 'aspect-video' : 'aspect-[4/3]'}`}
        style={project.accent_color ? { ['--card-accent' as string]: project.accent_color } : undefined}
      >
        <div className="flex h-6 items-center gap-1.5 border-b border-border-1 bg-surface-2 px-3" aria-hidden>
          <span className="size-1.5 rounded-full bg-text-4/40" />
          <span className="size-1.5 rounded-full bg-gold-500" />
          <span className="size-1.5 rounded-full bg-text-4/40" />
        </div>
        {cover ? (
          <div className="relative h-[calc(100%-1.5rem)] overflow-hidden">
            <Image
              src={cover}
              alt=""
              fill
              sizes={featured ? '(min-width:1280px) 820px, (min-width:768px) 100vw, 100vw' : '(min-width:1280px) 400px, (min-width:768px) 50vw, 100vw'}
              className="object-cover object-top transition-transform duration-[7s] ease-linear group-hover:translate-y-[calc(-100%+100cqh)] [container-type:size]"
            />
          </div>
        ) : (
          <div className="grid h-[calc(100%-1.5rem)] place-items-center bg-linear-to-br from-surface-1 via-surface-2 to-surface-3" style={{ backgroundImage: project.accent_color ? `radial-gradient(60% 60% at 30% 20%, ${project.accent_color}33, transparent 70%)` : undefined }}>
            <span className="font-display text-3xl text-text-3">{ar ? project.title_ar : project.title_en}</span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-3 top-9 flex items-start justify-between">
          {project.is_concept ? <Chip tone="gold">{t('concept')}</Chip> : <Chip tone="success">{t('live')}</Chip>}
        </div>
        {demo && (
          <a
            href={project.demo_route ? `/${locale}${project.demo_route}` : demo}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute end-3 bottom-3 z-20 inline-flex items-center gap-1.5 rounded-full border border-border-2 bg-(--overlay) px-3 py-1.5 text-xs font-medium text-text-1 backdrop-blur transition-[opacity,transform] duration-(--dur-moderate) ease-(--ease-out-quint) [@media(hover:hover)]:translate-y-2 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:translate-y-0 [@media(hover:hover)]:group-focus-within:opacity-100 hover:border-gold-500/45"
          >
            {t('openDemo')} <span aria-hidden className="rtl:-scale-x-100">↗</span>
          </a>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <h3 className="font-display text-2xl text-text-1">{ar ? project.title_ar : project.title_en}</h3>
        <Chip className="shrink-0">
          <PriceRangeText range={toRange(project.price_from_kwd, project.price_to_kwd)} currency={currency} locale={locale} />
        </Chip>
      </div>
      <div className="mt-2 flex items-center gap-3 text-xs text-text-3">
        <span className="uppercase tracking-wide rtl:normal-case rtl:tracking-normal">{ar ? project.category.name_ar : project.category.name_en}</span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden className={`size-1.5 rounded-full ${project.tier === 'elite' ? 'bg-gold-500' : 'bg-text-4'}`} />
          {t(`tier.${project.tier}`)}
        </span>
      </div>
    </article>
  )
}
