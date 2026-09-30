import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { whatsappHref } from '@/lib/site/whatsapp'

export const demoMetadata: Metadata = { robots: { index: false, follow: false } }

export type Loc = 'en' | 'ar'
export const L = (locale: string, en: string, ar: string) => (locale === 'ar' ? ar : en)

export async function getDemoLocale(): Promise<Loc> {
  const locale = await getLocale()
  return locale === 'ar' ? 'ar' : 'en'
}

/** 40px studio ribbon shown above every concept demo. */
export async function DemoBanner({ slug }: { slug: string }) {
  const locale = await getLocale()
  return (
    <div className="sticky top-0 z-50 flex h-10 items-center justify-between gap-4 border-b border-gold-500/30 bg-[#070707] px-4 text-xs text-[#f5f2ea] sm:px-6" dir={locale === 'ar' ? 'rtl' : 'ltr'} style={{ fontFamily: 'var(--font-body-latin)' }}>
      <Link href={`/work/${slug}`} className="inline-flex items-center gap-2 hover:text-[#e2c35c]">
        <svg aria-hidden viewBox="0 0 12 12" className="size-2 text-[#d4af37]"><path d="M6 0l6 6-6 6-6-6z" fill="currentColor" /></svg>
        {L(locale, 'Concept demo by Noxaur — fictional brand', 'نموذج تجريبي من نوكسور — علامة خيالية')}
      </Link>
      <Link href={{ pathname: '/contact', query: { ref: slug } }} className="font-medium text-[#e2c35c] hover:underline">
        {L(locale, 'Get a site like this →', '← اطلب موقعًا مثله')}
      </Link>
    </div>
  )
}

export async function DemoFooter({ slug, brand }: { slug: string; brand: string }) {
  const locale = await getLocale()
  return (
    <footer className="border-t border-demo-line px-6 py-8 text-center text-xs text-demo-muted">
      <p>{L(locale, `${brand} is a fictional business created to demonstrate a website concept.`, `${brand} علامة خيالية أُنشئت لعرض فكرة موقع إلكتروني.`)}</p>
      <Link href={`/work/${slug}`} className="mt-2 inline-block underline underline-offset-4 hover:text-demo-accent">
        {L(locale, 'Read the case study at Noxaur', 'اقرأ دراسة الحالة في نوكسور')}
      </Link>
    </footer>
  )
}

export const demoWhatsApp = (text: string) => whatsappHref('+96560643311', text)

export const kwd = (n: number, locale: string) =>
  new Intl.NumberFormat(locale === 'ar' ? 'ar-KW-u-nu-latn' : 'en-KW', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(n) + (locale === 'ar' ? ' د.ك' : ' KD')
