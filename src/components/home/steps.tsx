import { getTranslations } from 'next-intl/server'
import { Container, Section, SectionHeading } from '@/components/site/primitives'
import { RevealGroup, RevealItem } from '@/components/site/reveal'

export async function Steps() {
  const t = await getTranslations('Home.steps')
  const steps = ['brief', 'quote', 'build', 'launch'] as const
  return (
    <Section>
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />
        </div>
        <RevealGroup className="relative flex flex-col gap-8 border-s border-border-1 ps-8" stagger={0.09}>
          {steps.map((key, i) => (
            <RevealItem key={key} className="relative">
              <span aria-hidden className="absolute -start-8 top-1 flex size-4 -translate-x-1/2 items-center justify-center rounded-full bg-bg-0 ring-1 ring-gold-500 rtl:translate-x-1/2">
                <span className="size-1.5 rounded-full bg-gold-500" />
              </span>
              <p className="text-eyebrow font-semibold text-gold-500 tnum">0{i + 1}</p>
              <h3 className="mt-2 text-h3 font-semibold text-text-1">{t(`${key}.title`)}</h3>
              <p className="mt-2 max-w-lg leading-relaxed text-text-2">{t(`${key}.body`)}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  )
}
