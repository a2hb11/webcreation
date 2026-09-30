'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Link, usePathname } from '@/i18n/navigation'
import { DUR, EASE } from '@/lib/motion'

export type NavItem = { href: '/work' | '/services' | '/pricing' | '/about' | '/contact'; label: string }

export function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname()
  return (
    <ul className="hidden items-center gap-1 lg:flex">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={`group relative rounded-lg px-3 py-2 text-sm transition-colors duration-(--dur-base) ${active ? 'text-text-1' : 'text-text-2 hover:text-text-1'}`}
            >
              {item.label}
              <span
                aria-hidden
                className={`absolute inset-x-3 bottom-1 h-px origin-[inline-start] bg-gold-500 transition-transform duration-(--dur-base) ease-(--ease-out-cubic) ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
              />
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

// Adds the blurred background once the page is scrolled.
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-(--dur-base) ease-(--ease-out) ${scrolled ? 'border-b border-border-1 bg-(--overlay) backdrop-blur-xl' : 'border-b border-transparent'}`}
    >
      {children}
    </header>
  )
}

export function MobileMenu({ items, cta, controls, openLabel, closeLabel }: { items: NavItem[]; cta: React.ReactNode; controls: React.ReactNode; openLabel: string; closeLabel: string }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const [seenPath, setSeenPath] = useState(pathname)
  // Close the sheet after a navigation (state derived during render, not in an effect).
  if (pathname !== seenPath) {
    setSeenPath(pathname)
    if (open) setOpen(false)
  }
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [open])
  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex size-9 items-center justify-center rounded-lg border border-border-1 bg-surface-1 text-text-1"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: DUR.fast, ease: EASE.in } }}
            transition={{ duration: DUR.moderate, ease: EASE.outQuint }}
            className="fixed inset-x-0 top-16 bottom-0 z-30 flex flex-col bg-bg-0 px-6 pt-6 pb-10"
          >
            <motion.ul initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.04 } } }} className="flex flex-col gap-1">
              {items.map((item) => (
                <motion.li key={item.href} variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}>
                  <Link href={item.href} className="font-display block py-3 text-3xl text-text-1">
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
            <div className="mt-auto flex flex-col gap-4">
              {cta}
              <div className="flex items-center gap-2">{controls}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
