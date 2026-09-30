import { getTranslations } from 'next-intl/server'
import { Arrow, ButtonLink, Eyebrow } from '@/components/site/primitives'
import { HoursBadge } from '@/components/site/hours-badge'
import { HeroText } from '@/components/home/hero-text'
import { HeroStack } from '@/components/home/hero-stack'

export async function Hero() {
  const t = await getTranslations('Home.hero')
  const tf = await getTranslations('Footer')
  return (
    <section className="relative isolate overflow-hidden">
      <div className="hero-gradient" aria-hidden />
      <div className="hero-grain" aria-hidden />
      <div className="hero-scrim" aria-hidden />
      <div className="container-site relative grid min-h-[min(88svh,900px)] items-center gap-14 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:py-32">
        <div className="max-w-2xl">
          <HeroText
            eyebrow={<Eyebrow>{t('eyebrow')}</Eyebrow>}
            lines={[t('line1'), t('line2')]}
            accent={t('accent')}
            sub={t('sub')}
            ctas={
              <>
                <ButtonLink href="/contact">
                  {t('primary')}
                  <Arrow />
                </ButtonLink>
                <ButtonLink href="/work" variant="ghost">
                  {t('secondary')}
                </ButtonLink>
              </>
            }
            note={
              <span className="inline-flex flex-wrap items-center gap-2 text-sm text-text-3">
                {t('note')}
                <HoursBadge openLabel={tf('openNow')} closedLabel={tf('closedNow')} />
              </span>
            }
          />
        </div>
        <HeroStack />
      </div>
    </section>
  )
}
