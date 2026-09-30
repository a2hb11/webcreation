'use client'

import { useTransition } from 'react'
import { useLocale } from 'next-intl'
import { useParams } from 'next/navigation'
import { motion } from 'motion/react'
import { setCurrency, setTheme } from '@/app/actions/preferences'
import { Link, usePathname } from '@/i18n/navigation'
import { SPRING } from '@/lib/motion'

export function CurrencySwitcher({ codes, current, label }: { codes: string[]; current: string; label: string }) {
  const [pending, start] = useTransition()
  return (
    <label className="inline-flex items-center gap-2 text-xs text-text-3">
      <span className="sr-only">{label}</span>
      <select
        aria-label={label}
        defaultValue={current}
        disabled={pending}
        onChange={(e) => start(() => setCurrency(e.target.value))}
        className="rounded-lg border border-border-1 bg-surface-1 px-2 py-1.5 text-xs font-medium text-text-1 tnum outline-none transition hover:border-border-2 focus:border-gold-500"
      >
        {codes.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </label>
  )
}

export function ThemeToggle({ theme, label }: { theme: 'light' | 'dark'; label: string }) {
  const [pending, start] = useTransition()
  const next = theme === 'dark' ? 'light' : 'dark'
  return (
    <button
      type="button"
      aria-label={label}
      disabled={pending}
      onClick={() => start(() => setTheme(next))}
      className="inline-flex size-9 items-center justify-center rounded-lg border border-border-1 bg-surface-1 text-text-2 transition hover:border-border-2 hover:text-gold-400"
    >
      <motion.svg key={theme} initial={{ rotate: -30, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={SPRING.hover} viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75">
        {theme === 'dark' ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" strokeLinecap="round" />
          </>
        ) : (
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" strokeLinejoin="round" />
        )}
      </motion.svg>
    </button>
  )
}

// Keeps the current path, swaps the locale prefix.
export function LocaleSwitch() {
  const locale = useLocale()
  const pathname = usePathname()
  const params = useParams()
  const other = locale === 'ar' ? 'en' : 'ar'
  const href = { pathname, params } as unknown as Parameters<typeof Link>[0]['href']
  return (
    <Link
      href={href}
      locale={other}
      hrefLang={other}
      className="inline-flex h-9 items-center rounded-lg border border-border-1 bg-surface-1 px-3 text-xs font-semibold text-text-2 transition hover:border-border-2 hover:text-gold-400"
    >
      {other === 'ar' ? 'ع' : 'EN'}
    </Link>
  )
}
