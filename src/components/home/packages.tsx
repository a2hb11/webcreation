import { getTranslations } from 'next-intl/server'
import { getPackagesForCategory } from '@/lib/data/public'
import { getSelectedCurrency } from '@/lib/site/currency'
import { Arrow, ButtonLink, Container, Section, SectionHeading } from '@/components/site/primitives'
import { RevealGroup, RevealItem } from '@/components/site/reveal'
import { PackageCard } from '@/components/pricing/package-card'

export async function Packages() {
  const [t, packages, { current }] = await Promise.all([getTranslations('Home.packages'), getPackagesForCategory(null), getSelectedCurrency()])
  if (packages.length === 0) return null
  return (
    <Section band id="packages">
      <Container>
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} align="center" />
        <RevealGroup className="grid gap-6 lg:grid-cols-3">
          {packages.map((p) => (
            <RevealItem key={p.id}>
              <PackageCard pkg={p} currency={current} />
            </RevealItem>
          ))}
        </RevealGroup>
        <p className="mt-8 text-center text-sm text-text-3">{t('note')}</p>
        <div className="mt-6 flex justify-center">
          <ButtonLink href="/pricing" variant="link">
            {t('compare')}
            <Arrow />
          </ButtonLink>
        </div>
      </Container>
    </Section>
  )
}
