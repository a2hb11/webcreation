import { getLocale, getTranslations } from 'next-intl/server'
import { getPriceFactors } from '@/lib/data/public'
import { getSelectedCurrency } from '@/lib/site/currency'
import { Arrow, ButtonLink, Chip, Container, Section, SectionHeading } from '@/components/site/primitives'
import { RevealGroup, RevealItem } from '@/components/site/reveal'
import { PriceRangeText, toRange } from '@/components/site/price'

export async function FactorsTeaser() {
  const [t, locale, factors, { current }] = await Promise.all([getTranslations('Home.factors'), getLocale(), getPriceFactors(), getSelectedCurrency()])
  if (factors.length === 0) return null
  const ar = locale === 'ar'
  return (
    <Section id="factors">
      <Container>
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />
        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {factors.slice(0, 6).map((f) => (
            <RevealItem key={f.id} className="flex flex-col gap-3 rounded-card border border-border-1 bg-surface-1 p-6">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-text-1">{ar ? f.name_ar : f.name_en}</h3>
                <Chip tone="gold">
                  {f.pricing_mode === 'percent' ? (
                    <bdi dir="ltr">+{Number(f.delta_from_kwd)}–{Number(f.delta_to_kwd)}%</bdi>
                  ) : (
                    <>
                      +<PriceRangeText range={toRange(f.delta_from_kwd, f.delta_to_kwd)} currency={current} locale={locale} />
                      {f.pricing_mode === 'per_unit' && <span className="text-text-3">/{ar ? f.unit_label_ar : f.unit_label_en}</span>}
                    </>
                  )}
                </Chip>
              </div>
              <p className="text-sm leading-relaxed text-text-2">{ar ? f.description_ar : f.description_en}</p>
              <p className="mt-auto text-xs text-text-3">
                <span className="text-gold-500">{t('example')}</span> {ar ? f.example_ar : f.example_en}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
        <div className="mt-10 flex justify-center">
          <ButtonLink href={{ pathname: '/pricing', hash: 'calculator' }} variant="ghost">
            {t('calculator')}
            <Arrow />
          </ButtonLink>
        </div>
      </Container>
    </Section>
  )
}
