// Motion tokens (motion v13). Mirrors the CSS custom properties in
// globals.css so JS-driven and CSS-driven animation feel identical.

export const EASE = {
  out: [0.2, 0, 0, 1],
  outCubic: [0.215, 0.61, 0.355, 1],
  outExpo: [0.16, 1, 0.3, 1],
  outQuint: [0.22, 1, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1],
  in: [0.5, 0, 0.75, 0],
} as const

export const DUR = {
  instant: 0.08,
  fast: 0.15,
  base: 0.24,
  moderate: 0.4,
  slow: 0.6,
  hero: 0.9,
} as const

export const STAGGER = { word: 0.04, item: 0.06, card: 0.09 } as const

export const SPRING = {
  hover: { type: 'spring', stiffness: 400, damping: 32, mass: 0.8 },
  layout: { type: 'spring', stiffness: 220, damping: 30 },
} as const

// Scroll-reveal viewport settings: fire once, when 15% is visible.
export const VIEWPORT = { once: true, amount: 0.15, margin: '0px 0px -10% 0px' } as const

export const reveal = (y = 24) => ({
  hidden: { opacity: 0, y },
  visible: { opacity: 1, y: 0, transition: { duration: DUR.slow, ease: EASE.outExpo } },
})

// Enters from the reading-start side: from the left in LTR, the right in RTL.
export const slideIn = (dir: 'ltr' | 'rtl', distance = 12) => ({
  hidden: { opacity: 0, x: dir === 'rtl' ? distance : -distance },
  visible: { opacity: 1, x: 0, transition: { duration: DUR.moderate, ease: EASE.out } },
})

export const staggerChildren = (stagger = STAGGER.card, max = 6) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: 0, staggerDirection: 1 },
  },
  // Beyond `max` siblings the CSS grid should stagger by row instead.
  max,
})

export const exitFade = { opacity: 0, transition: { duration: DUR.fast, ease: EASE.in } } as const
