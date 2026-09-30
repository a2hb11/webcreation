import { cookies } from 'next/headers'
import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getSelectedCurrency } from '@/lib/site/currency'
import { Arrow, ButtonLink } from '@/components/site/primitives'
import { HeaderShell, MobileMenu, NavLinks, type NavItem } from '@/components/site/nav'
import { CurrencySwitcher, LocaleSwitch, ThemeToggle } from '@/components/site/switchers'
import { Logo } from '@/components/site/logo'

export async function Header() {
  const [t, locale, { current, all }, cookieStore] = await Promise.all([
    getTranslations('Nav'),
    getLocale(),
    getSelectedCurrency(),
    cookies(),
  ])
  const theme = cookieStore.get('theme')?.value === 'light' ? 'light' : 'dark'
  const items: NavItem[] = [
    { href: '/work', label: t('work') },
    { href: '/services', label: t('services') },
    { href: '/pricing', label: t('pricing') },
    { href: '/about', label: t('about') },
    { href: '/contact', label: t('contact') },
  ]
  const controls = (
    <>
      <CurrencySwitcher codes={all.map((c) => c.code)} current={current.code} label={t('currency')} />
      <LocaleSwitch />
      <ThemeToggle theme={theme} label={t('toggleTheme')} />
    </>
  )
  const cta = (
    <ButtonLink href="/contact" className="w-full lg:w-auto">
      {t('cta')}
      <Arrow />
    </ButtonLink>
  )
  return (
    <HeaderShell>
      <div className="container-site flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label={t('home')} className="flex items-center gap-2">
          <Logo />
        </Link>
        <NavLinks items={items} />
        <div className="hidden items-center gap-2 lg:flex">
          {controls}
          <span className="mx-1 h-6 w-px bg-border-1" aria-hidden />
          {cta}
        </div>
        <MobileMenu items={items} cta={cta} controls={controls} openLabel={t('openMenu')} closeLabel={t('closeMenu')} />
      </div>
      <span className="sr-only">{locale}</span>
    </HeaderShell>
  )
}
