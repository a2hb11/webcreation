import { getLocale, getTranslations } from 'next-intl/server'
import { getFaqs } from '@/lib/data/public'
import { Container, Section, SectionHeading } from '@/components/site/primitives'
import { Reveal } from '@/components/site/reveal'

export async function Faq({ limit = 6 }: { limit?: number }) {
  const [t, locale, faqs] = await Promise.all([getTranslations('Home.faq'), getLocale(), getFaqs()])
  if (faqs.length === 0) return null
  const ar = locale === 'ar'
  return (
    <Section id="faq">
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />
        <Reveal className="divide-y divide-border-1 border-y border-border-1">
          {faqs.slice(0, limit).map((f) => (
            <details key={f.id} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-start text-lg font-medium text-text-1 [&::-webkit-details-marker]:hidden">
                {ar ? f.question_ar : f.question_en}
                <svg aria-hidden viewBox="0 0 20 20" className="size-5 shrink-0 text-gold-500 transition-transform duration-(--dur-moderate) ease-(--ease-in-out) group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </summary>
              <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-(--dur-moderate) ease-(--ease-in-out) group-open:grid-rows-[1fr]">
                <p className="overflow-hidden pt-3 leading-relaxed text-text-2">{ar ? f.answer_ar : f.answer_en}</p>
              </div>
            </details>
          ))}
        </Reveal>
      </Container>
    </Section>
  )
}
