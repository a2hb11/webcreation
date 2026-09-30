import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getCategories, getPublicSettings } from '@/lib/data/public'
import { Logo } from '@/components/site/logo'
import { HoursBadge } from '@/components/site/hours-badge'
import { whatsappHref } from '@/lib/site/whatsapp'

const pick = (v: unknown, locale: string) =>
  v && typeof v === 'object' ? String((v as Record<string, string>)[locale] ?? (v as Record<string, string>).en ?? '') : typeof v === 'string' ? v : ''

export async function Footer() {
  const [t, locale, settings, categories] = await Promise.all([getTranslations('Footer'), getLocale(), getPublicSettings(), getCategories()])
  const whatsapp = typeof settings.whatsapp_number === 'string' ? settings.whatsapp_number : ''
  const instagram = typeof settings.instagram_handle === 'string' ? settings.instagram_handle : ''
  const email = typeof settings.contact_email === 'string' ? settings.contact_email : ''
  const hours = pick(settings.hours, locale)
  const location = pick(settings.location, locale)

  return (
    <footer className="border-t border-border-1 bg-bg-1">
      <div className="container-site grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-3">{t('tagline')}</p>
        </div>
        <nav aria-label={t('work')}>
          <p className="mb-4 text-eyebrow font-semibold text-text-3 uppercase rtl:normal-case">{t('work')}</p>
          <ul className="flex flex-col gap-2 text-sm">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={{ pathname: '/work', query: { cat: c.slug } }} className="text-text-2 transition hover:text-gold-400">
                  {locale === 'ar' ? c.name_ar : c.name_en}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label={t('studio')}>
          <p className="mb-4 text-eyebrow font-semibold text-text-3 uppercase rtl:normal-case">{t('studio')}</p>
          <ul className="flex flex-col gap-2 text-sm">
            {(
              [
                ['/services', t('services')],
                ['/pricing', t('pricing')],
                ['/about', t('about')],
                ['/contact', t('contact')],
              ] as const
            ).map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-text-2 transition hover:text-gold-400">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="mb-4 text-eyebrow font-semibold text-text-3 uppercase rtl:normal-case">{t('contact')}</p>
          <ul className="flex flex-col gap-3 text-sm text-text-2">
            {whatsapp && (
              <li>
                <a href={whatsappHref(whatsapp, t('whatsappText'))} target="_blank" rel="noopener noreferrer" className="transition hover:text-gold-400" dir="ltr">
                  {t('whatsapp')} · <span className="tnum">{whatsapp}</span>
                </a>
              </li>
            )}
            {email && (
              <li>
                <a href={`mailto:${email}`} className="transition hover:text-gold-400" dir="ltr">
                  {email}
                </a>
              </li>
            )}
            {instagram && (
              <li>
                <a href={`https://instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer" className="transition hover:text-gold-400" dir="ltr">
                  @{instagram}
                </a>
              </li>
            )}
            {hours && (
              <li className="flex flex-wrap items-center gap-2">
                <span>{hours}</span>
                <HoursBadge openLabel={t('openNow')} closedLabel={t('closedNow')} />
              </li>
            )}
            {location && <li className="text-text-3">{location}</li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-border-1">
        <div className="container-site flex flex-col gap-2 py-6 text-xs text-text-3 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Noxaur. {t('rights')}</p>
          <p>{t('madeIn')}</p>
        </div>
      </div>
    </footer>
  )
}
