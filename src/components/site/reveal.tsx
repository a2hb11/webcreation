'use client'

import { motion, type HTMLMotionProps } from 'motion/react'
import { DUR, EASE, STAGGER, VIEWPORT } from '@/lib/motion'

type Props = HTMLMotionProps<'div'> & { delay?: number; y?: number }

// Fade + rise once when scrolled into view. Respects reduced motion through
// <MotionConfig reducedMotion="user"> in the site layout.
export function Reveal({ delay = 0, y = 24, children, ...props }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: DUR.slow, ease: EASE.outExpo, delay }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Staggers direct children (max ~6) as they enter.
export function RevealGroup({ children, className = '', stagger = STAGGER.card }: { children: React.ReactNode; className?: string; stagger?: number }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({ children, className = '', y = 24 }: { children: React.ReactNode; className?: string; y?: number }) {
  return (
    <motion.div
      className={className}
      variants={{ hidden: { opacity: 0, y }, visible: { opacity: 1, y: 0, transition: { duration: DUR.slow, ease: EASE.outExpo } } }}
    >
      {children}
    </motion.div>
  )
}
