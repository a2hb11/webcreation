import type { Metadata } from 'next'
import '@/demos/marsa-chalets/theme.css'
import { marsaFonts } from '@/demos/marsa-chalets/fonts'
import { DemoBanner, DemoFooter, demoMetadata, L, getDemoLocale } from '@/components/demo/shell'
import { Link } from '@/i18n/navigation'

export const metadata: Metadata = { ...demoMetadata, title: 'Marsa Chalets — concept demo' }

export default async function Layout({ children }: { children: React.ReactNode }) {
  const l = await getDemoLocale()
  return (
    <div data-demo="marsa-chalets" className={`${marsaFonts} min-h-dvh`}>
      <DemoBanner slug="marsa-chalets" />
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/demo/marsa-chalets" className="font-demo-display text-2xl font-semibold text-demo-accent">{L(l, 'Marsa', 'مرسى')}</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/demo/marsa-chalets" className="hover:text-demo-accent">{L(l, 'Chalets', 'الشاليهات')}</Link>
          <Link href="/demo/marsa-chalets/book" className="rounded-demo bg-demo-accent px-4 py-2 font-semibold text-demo-on-accent">{L(l, 'Book', 'احجز')}</Link>
        </nav>
      </header>
      {children}
      <DemoFooter slug="marsa-chalets" brand="Marsa Chalets" />
    </div>
  )
}
