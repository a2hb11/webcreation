import { Header } from '@/components/site/header'
import { Footer } from '@/components/site/footer'
import { WhatsAppFab } from '@/components/site/whatsapp-fab'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main" className="min-h-dvh">
        {children}
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  )
}
