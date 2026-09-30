'use client'

import { useMemo, useState } from 'react'
import { demoWhatsApp, kwd, L } from '@/components/demo/shell'
import { blocked, chalets } from '@/demos/marsa-chalets/data'
import { addDays, quote } from '@/demos/marsa-chalets/pricing'

const field = 'w-full rounded-demo border border-demo-line bg-demo-surface px-3 py-2.5 text-sm outline-none focus:border-demo-accent'

export function BookClient({ locale, initial }: { locale: 'en' | 'ar'; initial?: string }) {
  const [slug, setSlug] = useState(chalets.find((c) => c.slug === initial)?.slug ?? chalets[0].slug)
  const [from, setFrom] = useState('2026-10-15')
  const [to, setTo] = useState('2026-10-17')
  const [guests, setGuests] = useState(6)
  const [step, setStep] = useState<'form' | 'paying' | 'done'>('form')
  const chalet = chalets.find((c) => c.slug === slug)!
  const q = useMemo(() => quote(chalet, from, to), [chalet, from, to])
  const clash = q.lines.filter((l) => blocked[slug]?.includes(l.date)).map((l) => l.date)
  const kind = { weekday: L(locale, 'weekday', 'يوم عادي'), weekend: L(locale, 'weekend', 'نهاية أسبوع'), holiday: L(locale, 'holiday', 'عطلة رسمية') }

  if (step === 'done') {
    return (
      <div className="rounded-demo border border-demo-accent/40 bg-demo-surface p-8 text-center">
        <p className="font-demo-display text-3xl">{L(locale, 'Booking BK-2026-0142 held', 'تم حجز BK-2026-0142')}</p>
        <p className="mt-2 text-demo-muted">{L(locale, 'Demo only — no payment taken. In production a WhatsApp confirmation and reminder are sent automatically.', 'نموذج تجريبي — لم يُخصم أي مبلغ. في الإنتاج يُرسل تأكيد وتذكير عبر واتساب تلقائيًا.')}</p>
      </div>
    )
  }
  if (step === 'paying') {
    return (
      <div className="rounded-demo border border-demo-line bg-demo-surface p-8 text-center">
        <p className="font-demo-display text-2xl">{L(locale, 'Redirecting to KNET for the deposit (demo)…', 'جارٍ التحويل إلى كي-نت لدفع العربون (تجريبي)…')}</p>
        <button type="button" onClick={() => setStep('done')} className="mt-6 rounded-demo bg-demo-accent px-6 py-3 text-sm font-semibold text-demo-on-accent">{L(locale, 'Simulate successful payment', 'محاكاة دفع ناجح')}</button>
      </div>
    )
  }
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (!q.error && clash.length === 0) setStep('paying') }} className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
      <div className="flex flex-col gap-4">
        <label className="text-sm text-demo-muted">{L(locale, 'Chalet', 'الشاليه')}
          <select value={slug} onChange={(e) => setSlug(e.target.value)} className={`${field} mt-1`}>{chalets.map((c) => <option key={c.slug} value={c.slug}>{c[locale]}</option>)}</select>
        </label>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="text-sm text-demo-muted">{L(locale, 'Check-in', 'الوصول')}<input type="date" value={from} min="2026-10-01" onChange={(e) => { setFrom(e.target.value); if (e.target.value >= to) setTo(addDays(e.target.value, 1)) }} className={`${field} mt-1 tnum`} dir="ltr" /></label>
          <label className="text-sm text-demo-muted">{L(locale, 'Check-out', 'المغادرة')}<input type="date" value={to} min={addDays(from, 1)} onChange={(e) => setTo(e.target.value)} className={`${field} mt-1 tnum`} dir="ltr" /></label>
          <label className="text-sm text-demo-muted">{L(locale, 'Guests', 'الضيوف')}<input type="number" min={1} max={chalet.capacity} value={guests} onChange={(e) => setGuests(Number(e.target.value))} className={`${field} mt-1 tnum`} /></label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <input required placeholder={L(locale, 'Full name', 'الاسم الكامل')} className={field} />
          <input required type="tel" dir="ltr" placeholder="+965" className={field} />
          <input placeholder={L(locale, 'Civil ID (demo: any digits)', 'الرقم المدني (تجريبي: أي أرقام)')} inputMode="numeric" className={field} dir="ltr" />
          <input placeholder={L(locale, 'Notes', 'ملاحظات')} className={field} />
        </div>
        {q.error === 'min_nights' && <p className="text-sm text-demo-accent-2">{L(locale, `This chalet needs at least ${chalet.minNights} nights.`, `هذا الشاليه يحتاج ${chalet.minNights} ليلة على الأقل.`)}</p>}
        {clash.length > 0 && (
          <div className="rounded-demo border border-demo-accent-2/50 bg-demo-accent-2/10 p-4 text-sm">
            <p>{L(locale, `Already booked on: ${clash.join(', ')}`, `محجوز مسبقًا في: ${clash.join('، ')}`)}</p>
            <a href={demoWhatsApp(L(locale, `Marsa Chalets waitlist: ${chalet.en}, ${from} → ${to}`, `قائمة انتظار شاليهات مرسى: ${chalet.ar}، ${from} ← ${to}`))} className="mt-2 inline-block font-semibold text-demo-accent underline">{L(locale, 'Join the waitlist on WhatsApp', 'انضم لقائمة الانتظار عبر واتساب')}</a>
          </div>
        )}
        <button type="submit" disabled={Boolean(q.error) || clash.length > 0} className="rounded-demo bg-demo-accent py-3 text-sm font-semibold text-demo-on-accent disabled:opacity-50">{L(locale, 'Pay the deposit', 'ادفع العربون')} · <span className="tnum" dir="ltr">{kwd(q.deposit, locale)}</span></button>
      </div>
      <aside className="self-start rounded-demo border border-demo-line bg-demo-surface p-5 text-sm">
        <h2 className="font-demo-display text-xl">{L(locale, 'Price breakdown', 'تفاصيل السعر')}</h2>
        <ul className="mt-3 divide-y divide-demo-line">
          {q.lines.map((l) => <li key={l.date} className={`flex justify-between py-2 ${blocked[slug]?.includes(l.date) ? 'text-demo-accent-2 line-through' : ''}`}><span className="tnum" dir="ltr">{l.date}</span><span className="text-demo-muted">{kind[l.kind]}</span><span className="tnum" dir="ltr">{kwd(l.price, locale)}</span></li>)}
        </ul>
        <p className="mt-3 flex justify-between font-semibold"><span>{L(locale, `Total · ${q.nights} nights`, `الإجمالي · ${q.nights} ليلة`)}</span><span className="tnum" dir="ltr">{kwd(q.total, locale)}</span></p>
        <p className="mt-1 flex justify-between text-demo-muted"><span>{L(locale, 'Deposit now (30%)', 'العربون الآن (30٪)')}</span><span className="tnum" dir="ltr">{kwd(q.deposit, locale)}</span></p>
        <p className="mt-1 flex justify-between text-demo-muted"><span>{L(locale, 'Balance at check-in', 'المتبقي عند الوصول')}</span><span className="tnum" dir="ltr">{kwd(q.balance, locale)}</span></p>
      </aside>
    </form>
  )
}
