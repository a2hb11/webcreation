'use client'

import { useState } from 'react'
import { kwd, L } from '@/components/demo/shell'
import type { Product } from '@/demos/bayt-misk/data'
import { useCart } from '@/demos/bayt-misk/cart'

export function ProductClient({ product, locale }: { product: Product; locale: 'en' | 'ar' }) {
  const [size, setSize] = useState<50 | 100>(50)
  const [wish, setWish] = useState(false)
  const { add } = useCart()
  const price = size === 50 ? product.price50 : product.price100
  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-2">
        {([50, 100] as const).map((s) => (
          <button key={s} type="button" onClick={() => setSize(s)} className={`rounded-demo border px-4 py-2 text-sm ${size === s ? 'border-demo-accent text-demo-accent' : 'border-demo-line'}`}>{s} ml · <span className="tnum" dir="ltr">{kwd(s === 50 ? product.price50 : product.price100, locale)}</span></button>
        ))}
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={() => add({ slug: product.slug, name: product[locale], size, price })} className="flex-1 rounded-demo bg-demo-accent py-3 text-sm font-semibold text-demo-on-accent">
          {product.preorder ? L(locale, 'Pre-order', 'اطلب مسبقًا') : L(locale, 'Add to bag', 'أضف إلى الحقيبة')} · <span className="tnum" dir="ltr">{kwd(price, locale)}</span>
        </button>
        <button type="button" onClick={() => setWish((w) => !w)} aria-pressed={wish} className={`rounded-demo border px-4 text-sm ${wish ? 'border-demo-accent text-demo-accent' : 'border-demo-line'}`}>♥</button>
      </div>
      <p className="text-xs text-demo-muted">{L(locale, 'KNET, Visa/Mastercard and Apple Pay at checkout · free gift wrap', 'كي-نت وفيزا/ماستركارد وApple Pay عند الدفع · تغليف هدايا مجاني')}</p>
    </div>
  )
}
