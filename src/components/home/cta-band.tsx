import { getTranslations } from 'next-intl/server'
import { getPublicSettings } from '@/lib/data/public'
import { Arrow, ButtonLink, Container, GoldRule } from '@/components/site/primitives'
import { Reveal } from '@/components/site/reveal'
import { whatsappHref } from '@/lib/site/whatsapp'
import { buttonClass } from '@/components/site/primitives'

export async function CtaBand() {
  const [t, tf, settings] = await Promise.all([getTranslations('Home.cta'), getTranslations('Footer'), getPublicSettings()])
  const whatsapp = typeof settings.whatsapp_number === 'string' ? settings.whatsapp_number : ''
  return (
    <section className="relative overflow-hidden">
      <GoldRule />
      <Container className="py-24 text-center md:py-32">
        <Reveal>
          <h2 className="font-display text-display-lg font-semibold text-text-1">{t('title')}</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-text-2">{t('lead')}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            {whatsapp && (
              <a href={whatsappHref(whatsapp, tf('whatsappText'))} target="_blank" rel="noopener noreferrer" className={buttonClass('primary')}>
                {t('whatsapp')}
                <Arrow />
              </a>
            )}
            <ButtonLink href="/contact" variant="ghost">
              {t('form')}
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
