'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Link } from '@/i18n/navigation'
import { kwd, L } from '@/components/demo/shell'
import { families, products, type Family } from '@/demos/bayt-misk/data'
import { Bottle } from '@/demos/bayt-misk/bottle'

export function ShopClient({ locale }: { locale: 'en' | 'ar' }) {
  const [family, setFamily] = useState<Family | ''>('')
  const [sort, setSort] = useState<'featured' | 'low' | 'high'>('featured')
  const list = products.filter((p) => !family || p.family === family).sort((a, b) => (sort === 'low' ? a.price50 - b.price50 : sort === 'high' ? b.price50 - a.price50 : 0))
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {[['', L(locale, 'All', 'الكل')], ...Object.entries(families).map(([k, v]) => [k, v[locale]])].map(([k, label]) => (
            <button key={k} type="button" onClick={() => setFamily(k as Family | '')} className={`rounded-demo border px-4 py-1.5 text-sm ${family === k ? 'border-demo-accent text-demo-accent' : 'border-demo-line text-demo-muted hover:text-demo-fg'}`}>{label}</button>
          ))}
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="rounded-demo border border-demo-line bg-demo-surface px-3 py-1.5 text-sm">
          <option value="featured">{L(locale, 'Featured', 'مميز')}</option>
          <option value="low">{L(locale, 'Price: low to high', 'السعر: من الأقل')}</option>
          <option value="high">{L(locale, 'Price: high to low', 'السعر: من الأعلى')}</option>
        </select>
      </div>
      <motion.ul layout className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {list.map((p) => (
            <motion.li key={p.slug} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3 }}>
              <Link href={`/demo/bayt-misk/product/${p.slug}`} className="group block">
                <div className="grid aspect-[4/5] place-items-center rounded-demo border border-demo-line bg-demo-surface transition-colors group-hover:border-demo-accent">
                  <Bottle hue={p.hue} className="w-2/5 transition-transform duration-500 group-hover:-translate-y-1" />
                </div>
                <div className="mt-3 flex items-start justify-between">
                  <div>
                    <p className="font-demo-display text-xl">{p[locale]}</p>
                    <p className="text-xs text-demo-muted">{families[p.family][locale]}{p.preorder ? ` · ${L(locale, 'pre-order', 'طلب مسبق')}` : ''}</p>
                  </div>
                  <p className="text-sm tnum" dir="ltr">{kwd(p.price50, locale)}</p>
                </div>
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </>
  )
}
