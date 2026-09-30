'use client'

import { motion } from 'motion/react'
import { Link, usePathname } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import { SPRING } from '@/lib/motion'

export type FilterOption = { value: string; label: string; count?: number }

function Row({ name, options, allLabel, param }: { name: string; options: FilterOption[]; allLabel: string; param: string }) {
  const pathname = usePathname()
  const search = useSearchParams()
  const current = search.get(param) ?? ''
  const hrefFor = (value: string) => {
    const next = new URLSearchParams(search.toString())
    if (value) next.set(param, value)
    else next.delete(param)
    const qs = next.toString()
    return `${pathname}${qs ? `?${qs}` : ''}`
  }
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [mask-image:linear-gradient(to_inline-end,#000_90%,transparent)] [scrollbar-width:none]" role="group" aria-label={name}>
      {[{ value: '', label: allLabel }, ...options].map((o) => {
        const active = current === o.value
        return (
          <Link
            key={o.value}
            href={hrefFor(o.value) as '/work'}
            scroll={false}
            className={`relative inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-4 text-sm whitespace-nowrap transition-colors ${active ? 'border-gold-500/50 text-gold-300 light:text-gold-700' : 'border-border-1 bg-surface-1 text-text-2 hover:text-text-1'}`}
          >
            {active && <motion.span layoutId={`chip-${param}`} transition={SPRING.layout} className="absolute inset-0 -z-10 rounded-full bg-gold-500/12" />}
            {o.label}
            {o.count !== undefined && <span className="text-xs text-text-3 tnum">{o.count}</span>}
          </Link>
        )
      })}
    </div>
  )
}

export function WorkFilters({ categories, tiers, labels }: { categories: FilterOption[]; tiers: FilterOption[]; labels: { all: string; category: string; tier: string } }) {
  return (
    <div className="sticky top-16 z-20 -mx-4 flex flex-col gap-2 border-b border-border-1 bg-(--overlay) px-4 py-3 backdrop-blur-xl sm:mx-0 sm:px-0">
      <Row name={labels.category} options={categories} allLabel={labels.all} param="cat" />
      <Row name={labels.tier} options={tiers} allLabel={labels.all} param="tier" />
    </div>
  )
}
