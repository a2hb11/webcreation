import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import { getPublicSettings } from '@/lib/data/public'
import { Container, Eyebrow, Section, SectionHeading } from '@/components/site/primitives'
import { Reveal, RevealGroup, RevealItem } from '@/components/site/reveal'
import { HoursBadge } from '@/components/site/hours-badge'
import { CtaBand } from '@/components/home/cta-band'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'AboutPage' })
  return { title: t('title'), description: t('statement') }
}

const pick = (v: unknown, locale: string) => (v && typeof v === 'object' ? String((v as Record<string, string>)[locale] ?? '') : '')

export default async function AboutPage() {
  const [t, tf, locale, settings] = await Promise.all([getTranslations('AboutPage'), getTranslations('Footer'), getLocale(), getPublicSettings()])
  const principles = ['fixed', 'contact', 'bilingual', 'own'] as const
  const stack = ['Next.js', 'React', 'TypeScript', 'Supabase', 'Postgres', 'Vercel', 'Tailwind', 'KNET · MyFatoorah · Tap']
  return (
    <>
      <Container className="pt-16 pb-20 md:pt-24 md:pb-28">
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <Reveal>
          <h1 className="font-display mt-4 max-w-4xl text-display-lg font-semibold leading-tight text-text-1">{t('statement')}</h1>
        </Reveal>
        <p className="mt-8 max-w-2xl text-lg text-text-2">{t('lead')}</p>
      </Container>
      <Section band>
        <Container>
          <SectionHeading eyebrow={t('howEyebrow')} title={t('howTitle')} />
          <RevealGroup className="grid gap-4 md:grid-cols-2">
            {principles.map((k, i) => (
              <RevealItem key={k} className="rounded-card border border-border-1 bg-surface-1 p-7">
                <p className="text-eyebrow font-semibold text-gold-500 tnum">0{i + 1}</p>
                <h3 className="mt-3 text-h3 font-semibold text-text-1">{t(`principles.${k}.title`)}</h3>
                <p className="mt-2 leading-relaxed text-text-2">{t(`principles.${k}.body`)}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>
      <Section>
        <Container className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading eyebrow={t('stackEyebrow')} title={t('stackTitle')} lead={t('stackLead')} />
            <ul className="flex flex-wrap gap-2">
              {stack.map((s) => (
                <li key={s} className="rounded-lg border border-border-1 bg-surface-1 px-3 py-1.5 text-sm text-text-2">{s}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <SectionHeading eyebrow={t('whereEyebrow')} title={t('whereTitle')} lead={t('whereLead')} />
            <div className="flex flex-col gap-3 text-text-2">
              <p>{pick(settings.location, locale)}</p>
              <p className="flex flex-wrap items-center gap-2">
                {pick(settings.hours, locale)} <HoursBadge openLabel={tf('openNow')} closedLabel={tf('closedNow')} />
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>
      <CtaBand />
    </>
  )
}
