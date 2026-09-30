import type { Metadata } from 'next'
import '@/demos/sahwa-roasters/theme.css'
import { sahwaFonts } from '@/demos/sahwa-roasters/fonts'
import { DemoBanner, DemoFooter, demoMetadata, L, getDemoLocale } from '@/components/demo/shell'
import { Link } from '@/i18n/navigation'

export const metadata: Metadata = { ...demoMetadata, title: 'Sahwa Roasters — concept demo' }

export default async function Layout({ children }: { children: React.ReactNode }) {
  const l = await getDemoLocale()
  return (
    <div data-demo="sahwa-roasters" className={`${sahwaFonts} min-h-dvh`}>
      <DemoBanner slug="sahwa-roasters" />
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/demo/sahwa-roasters" className="font-demo-display text-2xl font-semibold text-demo-accent">{L(l, 'Sahwa', 'صحوة')}</Link>
        <nav className="flex gap-4 text-sm">
          <Link href="/demo/sahwa-roasters" className="hover:text-demo-accent">{L(l, 'Story', 'قصتنا')}</Link>
          <Link href="/demo/sahwa-roasters/menu" className="hover:text-demo-accent">{L(l, 'Menu & order', 'القائمة والطلب')}</Link>
        </nav>
      </header>
      {children}
      <DemoFooter slug="sahwa-roasters" brand="Sahwa Roasters" />
    </div>
  )
}
