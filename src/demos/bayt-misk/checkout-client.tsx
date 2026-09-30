'use client'

import { useState } from 'react'
import { kwd, L } from '@/components/demo/shell'
import { useCart } from '@/demos/bayt-misk/cart'

const field = 'w-full rounded-demo border border-demo-line bg-demo-surface px-3 py-2.5 text-sm outline-none focus:border-demo-accent'

export function CheckoutClient({ locale }: { locale: 'en' | 'ar' }) {
  const { lines, total, clear } = useCart()
  const [step, setStep] = useState<'form' | 'paying' | 'done'>('form')
  const [method, setMethod] = useState<'knet' | 'card' | 'applepay'>('knet')
  const shipping = total >= 40 || total === 0 ? 0 : 2
  const points = Math.floor((total + shipping) * 10)

  if (step === 'done') {
    return (
      <div className="rounded-demo border border-demo-accent/50 p-8 text-center">
        <p className="font-demo-display text-3xl">{L(locale, 'Order ORD-2026-0001 confirmed', 'تم تأكيد الطلب ORD-2026-0001')}</p>
        <p className="mt-2 text-demo-muted">{L(locale, `Demo only — no payment was taken. You earned ${points} loyalty points.`, `نموذج تجريبي — لم يُخصم أي مبلغ. ربحت ${points} نقطة ولاء.`)}</p>
      </div>
    )
  }
  if (step === 'paying') {
    return (
      <div className="rounded-demo border border-demo-line p-8 text-center">
        <p className="font-demo-display text-2xl">{L(locale, 'Redirecting to payment (demo)…', 'جارٍ التحويل إلى صفحة الدفع (تجريبي)…')}</p>
        <p className="mt-2 text-sm text-demo-muted">{L(locale, 'In production this is the hosted KNET / card / Apple Pay page of the payment gateway.', 'في الإنتاج هذه صفحة الدفع المستضافة لبوابة كي-نت / البطاقات / Apple Pay.')}</p>
        <button type="button" onClick={() => { clear(); setStep('done') }} className="mt-6 rounded-demo bg-demo-accent px-6 py-3 text-sm font-semibold text-demo-on-accent">{L(locale, 'Simulate successful payment', 'محاكاة دفع ناجح')}</button>
      </div>
    )
  }
  return (
    <form onSubmit={(e) => { e.preventDefault(); setStep('paying') }} className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="flex flex-col gap-4">
        <h2 className="font-demo-display text-2xl">{L(locale, 'Delivery', 'التوصيل')}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <input required placeholder={L(locale, 'Full name', 'الاسم الكامل')} className={field} />
          <input required type="tel" dir="ltr" placeholder="+965" className={field} />
          <input required placeholder={L(locale, 'Area', 'المنطقة')} className={field} />
          <input required placeholder={L(locale, 'Block / Street / House', 'قطعة / شارع / منزل')} className={field} />
        </div>
        <label className="text-sm text-demo-muted">{L(locale, 'Delivery slot', 'وقت التوصيل')}
          <select className={`${field} mt-1`}><option>{L(locale, 'Today 6–9 pm', 'اليوم 6–9 مساءً')}</option><option>{L(locale, 'Tomorrow 12–3 pm', 'غدًا 12–3 ظهرًا')}</option></select>
        </label>
        <h2 className="font-demo-display mt-4 text-2xl">{L(locale, 'Payment', 'الدفع')}</h2>
        <div className="grid gap-2 sm:grid-cols-3">
          {([['knet', 'KNET'], ['card', L(locale, 'Visa / Mastercard', 'فيزا / ماستركارد')], ['applepay', 'Apple Pay']] as const).map(([k, label]) => (
            <button key={k} type="button" onClick={() => setMethod(k)} className={`rounded-demo border px-4 py-3 text-sm ${method === k ? 'border-demo-accent text-demo-accent' : 'border-demo-line'}`}>{label}</button>
          ))}
        </div>
        <button type="submit" disabled={lines.length === 0} className="mt-2 rounded-demo bg-demo-accent py-3 text-sm font-semibold text-demo-on-accent disabled:opacity-50">{L(locale, 'Pay', 'ادفع')} <span className="tnum" dir="ltr">{kwd(total + shipping, locale)}</span></button>
      </div>
      <aside className="self-start rounded-demo border border-demo-line p-5 text-sm">
        <h2 className="font-demo-display text-xl">{L(locale, 'Summary', 'الملخص')}</h2>
        <ul className="mt-3 divide-y divide-demo-line">
          {lines.map((l) => <li key={`${l.slug}-${l.size}`} className="flex justify-between py-2"><span>{l.qty} × {l.name} · {l.size} ml</span><span className="tnum" dir="ltr">{kwd(l.price * l.qty, locale)}</span></li>)}
        </ul>
        <p className="mt-3 flex justify-between text-demo-muted"><span>{L(locale, 'Delivery', 'التوصيل')}</span><span className="tnum" dir="ltr">{shipping ? kwd(shipping, locale) : L(locale, 'Free', 'مجاني')}</span></p>
        <p className="mt-1 flex justify-between font-semibold"><span>{L(locale, 'Total', 'الإجمالي')}</span><span className="tnum" dir="ltr">{kwd(total + shipping, locale)}</span></p>
        <p className="mt-3 text-xs text-demo-muted">{L(locale, `+${points} loyalty points on this order`, `+${points} نقطة ولاء على هذا الطلب`)}</p>
      </aside>
    </form>
  )
}
