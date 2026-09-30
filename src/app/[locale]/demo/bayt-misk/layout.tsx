import type { Metadata } from 'next'
import '@/demos/bayt-misk/theme.css'
import { miskFonts } from '@/demos/bayt-misk/fonts'
import { DemoBanner, DemoFooter, demoMetadata, L, getDemoLocale } from '@/components/demo/shell'
import { Link } from '@/i18n/navigation'
import { CartButton, CartDrawer, CartProvider } from '@/demos/bayt-misk/cart'

export const metadata: Metadata = { ...demoMetadata, title: 'Bayt Misk — concept demo' }

export default async function Layout({ children }: { children: React.ReactNode }) {
  const l = await getDemoLocale()
  return (
    <div data-demo="bayt-misk" className={`${miskFonts} min-h-dvh`}>
      <CartProvider>
        <DemoBanner slug="bayt-misk" />
        <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/demo/bayt-misk" className="font-demo-display text-2xl tracking-wide text-demo-accent">{L(l, 'BAYT MISK', 'بيت مسك')}</Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/demo/bayt-misk/shop" className="hover:text-demo-accent">{L(l, 'Shop', 'المتجر')}</Link>
            <CartButton locale={l} />
          </nav>
        </header>
        {children}
        <CartDrawer locale={l} />
        <DemoFooter slug="bayt-misk" brand="Bayt Misk" />
      </CartProvider>
    </div>
  )
}
