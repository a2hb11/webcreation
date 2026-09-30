import { getTranslations } from 'next-intl/server'
import { getFeaturedProjects, getProjects } from '@/lib/data/public'
import { getSelectedCurrency } from '@/lib/site/currency'
import { Arrow, ButtonLink, Container, Section, SectionHeading } from '@/components/site/primitives'
import { RevealGroup, RevealItem } from '@/components/site/reveal'
import { ProjectCard } from '@/components/work/project-card'

export async function Showcase() {
  const [t, featured, all, { current }] = await Promise.all([getTranslations('Home.showcase'), getFeaturedProjects(), getProjects(), getSelectedCurrency()])
  const projects = (featured.length >= 3 ? featured : all).slice(0, 6)
  if (projects.length === 0) return null
  return (
    <Section band id="work">
      <Container>
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />
        <RevealGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <RevealItem key={p.id}>
              <ProjectCard project={p} currency={current} />
            </RevealItem>
          ))}
        </RevealGroup>
        <div className="mt-12 flex justify-center">
          <ButtonLink href="/work" variant="ghost">
            {t('all')}
            <Arrow />
          </ButtonLink>
        </div>
      </Container>
    </Section>
  )
}
