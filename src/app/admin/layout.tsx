import type { Metadata } from 'next'
import { bodyLatin } from '@/app/fonts'
import '@/app/globals.css'

// Separate root layout: the admin area is English-only, always dark, and
// never indexed. Authorization happens in each page via requireAdmin().
export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false, nocache: true },
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" data-theme="dark" className={bodyLatin.variable}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  )
}
