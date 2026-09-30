'use client'

import { motion } from 'motion/react'
import { EASE } from '@/lib/motion'

const line = {
  hidden: { clipPath: 'inset(0 0 100% 0)', y: 40, opacity: 0 },
  visible: { clipPath: 'inset(0 0 0% 0)', y: 0, opacity: 1, transition: { duration: 0.9, ease: EASE.outExpo } },
}
const fade = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE.outExpo } } }

// Masked line reveal for the hero. Lines (not characters) so Arabic shaping
// stays intact; the accent word is italic gold in Latin, gold only in Arabic.
export function HeroText({ eyebrow, lines, accent, sub, ctas, note }: { eyebrow: React.ReactNode; lines: string[]; accent: string; sub: string; ctas: React.ReactNode; note: React.ReactNode }) {
  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.09 } } }}>
      <motion.div variants={fade}>{eyebrow}</motion.div>
      <h1 className="font-display mt-6 text-display-xl font-semibold text-text-1">
        {lines.map((text, i) => (
          <motion.span key={i} variants={line} className="block">
            {i === lines.length - 1 ? (
              <>
                {text}{' '}
                <em className="gold-gradient-text not-italic ltr:italic">{accent}</em>
              </>
            ) : (
              text
            )}
          </motion.span>
        ))}
      </h1>
      <motion.p variants={fade} className="mt-7 max-w-xl text-lg leading-relaxed text-text-2 md:text-xl">
        {sub}
      </motion.p>
      <motion.div variants={fade} className="mt-9 flex flex-wrap gap-3">
        {ctas}
      </motion.div>
      <motion.div variants={fade} className="mt-6">
        {note}
      </motion.div>
    </motion.div>
  )
}
