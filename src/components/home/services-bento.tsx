import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getCategories, getPackages, TIERS } from '@/lib/data/public'
import { getSelectedCurrency } from '@/lib/site/currency'
import { Arrow, Chip, Container, Section, SectionHeading } from '@/components/site/primitives'
import { RevealGroup, RevealItem } from '@/components/site/reveal'
import { CategoryIcon } from '@/components/site/category-icon'
import { convertFromKwd, formatMoney } from '@/lib/pricing/engine'

export async function ServicesBento() {
  const [t, locale, categories, packages, { current }] = await Promise.all([getTranslations('Home.services'), getLocale(), getCategories(), getPackages(), getSelectedCurrency()])
  if (categories.length === 0) return null
  const startingPrice = (categoryId: string) => {
    const own = packages.filter((p) => p.category_id === categoryId)
    const pool = own.length ? own : packages.filter((p) => p.category_id === null)
    const starter = pool.find((p) => p.tier === TIERS[0]) ?? pool[0]
    return starter ? formatMoney(convertFromKwd(Number(starter.price_from_kwd), current), current, locale) : null
  }
  const wide = new Set(['online-stores', 'web-apps'])
  return (
    <Section id="services">
      <Container>
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />
        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => {
            const from = startingPrice(c.id)
            return (
              <RevealItem key={c.id} className={wide.has(c.slug) ? 'lg:col-span-2' : ''}>
                <Link
                  href={{ pathname: '/services', hash: c.slug }}
                  className="group flex h-full flex-col rounded-card border border-border-1 bg-surface-1 p-6 transition-[background-color,border-color] duration-(--dur-base) ease-(--ease-out) hover:border-gold-500/40 hover:bg-surface-2"
                >
                  <CategoryIcon name={c.icon} className="size-6 text-gold-500 transition-transform duration-(--dur-base) group-hover:-translate-y-0.5" />
                  <h3 className="mt-5 text-h3 font-semibold text-text-1">{locale === 'ar' ? c.name_ar : c.name_en}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-2">{locale === 'ar' ? c.description_ar : c.description_en}</p>
                  <div className="mt-auto flex items-center justify-between pt-6">
                    {from ? <Chip tone="gold">{t('from', { price: from })}</Chip> : <span />}
                    <Arrow className="text-text-3 group-hover:text-gold-400" />
                  </div>
                </Link>
              </RevealItem>
            )
          })}
        </RevealGroup>
      </Container>
    </Section>
  )
}
