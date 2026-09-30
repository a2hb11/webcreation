'use client'

import { motion } from 'motion/react'
import { EASE } from '@/lib/motion'

// Three stacked "browser" frames suggesting finished sites. Pure CSS/SVG so
// it needs no images and renders identically in both languages.
const frames = [
  { rotate: -4, x: -8, y: 24, accent: 'var(--gold-500)', bars: [70, 40, 55] },
  { rotate: 0, x: 0, y: 0, accent: 'var(--gold-300)', bars: [60, 85, 45] },
  { rotate: 4, x: 8, y: -24, accent: 'var(--gold-600)', bars: [50, 65, 80] },
]

export function HeroStack() {
  return (
    <div className="relative mx-auto hidden aspect-[4/3] w-full max-w-md lg:block" aria-hidden>
      {frames.map((f, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 40, rotate: 0 }}
          animate={{ opacity: 1, y: f.y, rotate: f.rotate, x: f.x }}
          transition={{ duration: 0.9, ease: EASE.outExpo, delay: 0.35 + i * 0.12 }}
          className="absolute inset-0 rounded-2xl border border-border-1 bg-surface-1 shadow-[0_24px_60px_-24px_rgb(212_175_55/0.25)]"
          style={{ zIndex: i }}
        >
          <div className="flex h-7 items-center gap-1.5 border-b border-border-1 px-3">
            <span className="size-1.5 rounded-full bg-text-4/40" />
            <span className="size-1.5 rounded-full" style={{ background: f.accent }} />
            <span className="size-1.5 rounded-full bg-text-4/40" />
          </div>
          <div className="space-y-3 p-5">
            <div className="h-3 w-1/3 rounded bg-text-4/30" />
            <div className="h-8 rounded" style={{ width: `${f.bars[0]}%`, background: 'var(--surface-3)' }} />
            <div className="grid grid-cols-3 gap-3 pt-2">
              {f.bars.map((h, j) => (
                <div key={j} className="rounded-lg bg-surface-2" style={{ height: h }} />
              ))}
            </div>
            <div className="mt-2 h-8 w-28 rounded-lg" style={{ background: f.accent, opacity: 0.85 }} />
          </div>
        </motion.div>
      ))}
    </div>
  )
}
