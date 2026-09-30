'use client'

import { createContext, useContext, useMemo, useState, useSyncExternalStore } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { kwd, L } from '@/components/demo/shell'
import { Link } from '@/i18n/navigation'

export type CartLine = { slug: string; name: string; size: 50 | 100; price: number; qty: number }
type Ctx = { lines: CartLine[]; add: (l: Omit<CartLine, 'qty'>) => void; remove: (slug: string, size: number) => void; clear: () => void; total: number; open: boolean; setOpen: (v: boolean) => void }

const CartContext = createContext<Ctx | null>(null)
const KEY = 'bayt-misk-cart'

// Minimal external store backed by sessionStorage, so the cart survives
// navigation within the demo without setState-in-effect hydration hacks.
let cache: CartLine[] | null = null
const listeners = new Set<() => void>()
const read = (): CartLine[] => {
  if (cache) return cache
  try {
    cache = JSON.parse(sessionStorage.getItem(KEY) ?? '[]') as CartLine[]
  } catch {
    cache = []
  }
  return cache
}
const write = (next: CartLine[]) => {
  cache = next
  try {
    sessionStorage.setItem(KEY, JSON.stringify(next))
  } catch {}
  listeners.forEach((l) => l())
}
const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}
const EMPTY: CartLine[] = []

export function CartProvider({ children }: { children: React.ReactNode }) {
  const lines = useSyncExternalStore(subscribe, read, () => EMPTY)
  const [open, setOpen] = useState(false)
  const value = useMemo<Ctx>(
    () => ({
      lines,
      open,
      setOpen,
      total: lines.reduce((s, l) => s + l.price * l.qty, 0),
      add: (l) => {
        const c = read()
        const i = c.findIndex((x) => x.slug === l.slug && x.size === l.size)
        write(i >= 0 ? c.map((x, j) => (j === i ? { ...x, qty: x.qty + 1 } : x)) : [...c, { ...l, qty: 1 }])
        setOpen(true)
      },
      remove: (slug, size) => write(read().filter((x) => !(x.slug === slug && x.size === size))),
      clear: () => write([]),
    }),
    [lines, open],
  )
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('CartProvider missing')
  return ctx
}

export function CartButton({ locale }: { locale: 'en' | 'ar' }) {
  const { lines, setOpen } = useCart()
  const count = lines.reduce((s, l) => s + l.qty, 0)
  return (
    <button type="button" onClick={() => setOpen(true)} className="rounded-demo border border-demo-line px-4 py-2 text-sm hover:border-demo-accent">
      {L(locale, 'Bag', 'الحقيبة')} <span className="tnum text-demo-accent">{count}</span>
    </button>
  )
}

export function CartDrawer({ locale }: { locale: 'en' | 'ar' }) {
  const { lines, remove, total, open, setOpen } = useCart()
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button aria-label="close" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-black/60" />
          <motion.aside initial={{ x: locale === 'ar' ? '-100%' : '100%' }} animate={{ x: 0 }} exit={{ x: locale === 'ar' ? '-100%' : '100%' }} transition={{ type: 'spring', stiffness: 260, damping: 30 }} className="fixed inset-y-0 end-0 z-50 flex w-full max-w-sm flex-col border-s border-demo-line bg-demo-surface p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-demo-display text-2xl">{L(locale, 'Your bag', 'حقيبتك')}</h2>
              <button type="button" onClick={() => setOpen(false)} className="text-demo-muted">✕</button>
            </div>
            <ul className="mt-6 flex-1 divide-y divide-demo-line overflow-auto">
              {lines.length === 0 && <li className="py-6 text-sm text-demo-muted">{L(locale, 'Nothing here yet.', 'لا شيء هنا بعد.')}</li>}
              {lines.map((l) => (
                <li key={`${l.slug}-${l.size}`} className="flex items-center justify-between py-3 text-sm">
                  <span>{l.qty} × {l.name} · {l.size} ml</span>
                  <span className="flex items-center gap-3"><span className="tnum" dir="ltr">{kwd(l.price * l.qty, locale)}</span><button type="button" onClick={() => remove(l.slug, l.size)} className="text-demo-accent">−</button></span>
                </li>
              ))}
            </ul>
            <div className="border-t border-demo-line pt-4">
              <p className="flex justify-between text-sm"><span>{L(locale, 'Subtotal', 'المجموع')}</span><span className="tnum" dir="ltr">{kwd(total, locale)}</span></p>
              <p className="mt-1 text-xs text-demo-muted">{L(locale, 'Free delivery in Kuwait over 40 KD · GCC shipping at checkout', 'توصيل مجاني في الكويت فوق 40 د.ك · شحن خليجي عند الدفع')}</p>
              <Link href="/demo/bayt-misk/checkout" onClick={() => setOpen(false)} className={`mt-4 block rounded-demo bg-demo-accent py-3 text-center text-sm font-semibold text-demo-on-accent ${lines.length === 0 ? 'pointer-events-none opacity-50' : ''}`}>{L(locale, 'Checkout', 'إتمام الشراء')}</Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
