'use client'

import { useMemo, useState } from 'react'
import { demoWhatsApp, kwd, L } from '@/components/demo/shell'
import { branches, menu } from '@/demos/sahwa-roasters/data'

type Line = { key: string; name: string; size: string; price: number; qty: number }

export function MenuClient({ locale }: { locale: 'en' | 'ar' }) {
  const [lines, setLines] = useState<Record<string, Line>>({})
  const [branch, setBranch] = useState(branches[0].id)
  const [query, setQuery] = useState('')
  const l = locale
  const total = useMemo(() => Object.values(lines).reduce((s, x) => s + x.price * x.qty, 0), [lines])
  const count = Object.values(lines).reduce((s, x) => s + x.qty, 0)

  const add = (name: string, size: string, price: number) =>
    setLines((c) => {
      const key = `${name}|${size}`
      const prev = c[key]
      return { ...c, [key]: { key, name, size, price, qty: (prev?.qty ?? 0) + 1 } }
    })
  const remove = (key: string) =>
    setLines((c) => {
      const next = { ...c }
      if (!next[key]) return c
      if (next[key].qty > 1) next[key] = { ...next[key], qty: next[key].qty - 1 }
      else delete next[key]
      return next
    })

  const branchName = branches.find((b) => b.id === branch)![l]
  const message = `${L(l, 'Order from Sahwa Roasters', 'طلب من محمصة صحوة')}\n${L(l, 'Branch', 'الفرع')}: ${branchName}\n${Object.values(lines)
    .map((x) => `${x.qty} × ${x.name} (${x.size}) — ${kwd(x.price * x.qty, l)}`)
    .join('\n')}\n${L(l, 'Total', 'الإجمالي')}: ${kwd(total, l)}\n${L(l, 'Pickup in ~15 min', 'الاستلام خلال ~15 دقيقة')}`

  const q = query.trim().toLowerCase()
  const filtered = menu.map((c) => ({ ...c, items: c.items.filter((i) => !q || i[l].toLowerCase().includes(q) || i.en.toLowerCase().includes(q)) })).filter((c) => c.items.length)

  return (
    <div className="pb-32">
      <div className="sticky top-10 z-30 -mx-5 border-b border-demo-line bg-demo-bg/95 px-5 py-3 backdrop-blur sm:mx-0 sm:px-0">
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none]">
          {menu.map((c) => (
            <a key={c.id} href={`#${c.id}`} className="shrink-0 rounded-full border border-demo-line bg-demo-surface px-4 py-1.5 text-sm hover:border-demo-accent">{c[l]}</a>
          ))}
        </div>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={L(l, 'Search the menu…', 'ابحث في القائمة…')} className="mt-3 w-full rounded-demo border border-demo-line bg-demo-surface px-4 py-2 text-sm outline-none focus:border-demo-accent" />
      </div>
      {filtered.map((c) => (
        <section key={c.id} id={c.id} className="scroll-mt-32 py-8">
          <h2 className="font-demo-display text-2xl font-semibold">{c[l]}</h2>
          <ul className="mt-4 divide-y divide-demo-line">
            {c.items.map((i) => (
              <li key={i.id} className="flex flex-wrap items-start justify-between gap-3 py-4">
                <div>
                  <p className="font-medium">{i[l]}</p>
                  {(l === 'ar' ? i.note_ar : i.note_en) && <p className="text-sm text-demo-muted">{l === 'ar' ? i.note_ar : i.note_en}</p>}
                  {i.tags && <p className="mt-1 text-xs text-demo-muted">{i.tags.map((t) => ({ milk: L(l, 'contains milk', 'يحتوي حليب'), nuts: L(l, 'nuts', 'مكسرات'), vegan: L(l, 'vegan', 'نباتي') })[t]).join(' · ')}</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {i.sizes.map((s) => (
                    <button key={s.en} type="button" onClick={() => add(i[l], s[l], s.price)} className="rounded-demo border border-demo-line bg-demo-surface px-3 py-1.5 text-sm hover:border-demo-accent">
                      {s[l]} · <span className="tnum" dir="ltr">{kwd(s.price, l)}</span>
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {count > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-demo-line bg-demo-surface p-4 shadow-[0_-20px_60px_-30px_rgb(0_0_0/0.4)]">
          <div className="mx-auto flex max-w-5xl flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm"><span className="font-semibold tnum">{count}</span> {L(l, 'items', 'عناصر')} · <span className="tnum" dir="ltr">{kwd(total, l)}</span></p>
              <select value={branch} onChange={(e) => setBranch(e.target.value)} className="rounded-demo border border-demo-line bg-demo-bg px-3 py-1.5 text-sm">
                {branches.map((b) => <option key={b.id} value={b.id}>{b[l]}</option>)}
              </select>
            </div>
            <ul className="flex flex-wrap gap-2 text-xs">
              {Object.values(lines).map((x) => (
                <li key={x.key} className="inline-flex items-center gap-2 rounded-full border border-demo-line px-3 py-1">
                  <span className="tnum">{x.qty}×</span> {x.name} · {x.size}
                  <button type="button" onClick={() => remove(x.key)} aria-label={L(l, 'Remove one', 'إزالة واحد')} className="text-demo-accent">−</button>
                </li>
              ))}
            </ul>
            <a href={demoWhatsApp(message)} target="_blank" rel="noopener noreferrer" className="rounded-demo bg-demo-accent py-3 text-center text-sm font-semibold text-demo-on-accent">{L(l, 'Send order on WhatsApp', 'أرسل الطلب على واتساب')}</a>
          </div>
        </div>
      )}
    </div>
  )
}
