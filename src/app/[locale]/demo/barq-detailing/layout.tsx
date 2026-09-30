import type { Metadata } from 'next'
import '@/demos/barq-detailing/theme.css'
import { barqFonts } from '@/demos/barq-detailing/fonts'
import { DemoBanner, DemoFooter, demoMetadata } from '@/components/demo/shell'

export const metadata: Metadata = { ...demoMetadata, title: 'Barq Detailing — concept demo' }

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div data-demo="barq-detailing" className={`${barqFonts} min-h-dvh`}>
      <DemoBanner slug="barq-detailing" />
      {children}
      <DemoFooter slug="barq-detailing" brand="Barq Detailing" />
    </div>
  )
}
