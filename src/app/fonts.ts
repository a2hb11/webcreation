import { Amiri, Cormorant_Garamond, IBM_Plex_Sans_Arabic, Manrope } from 'next/font/google'

// Provisional pairing (black + gold, luxury): editorial serif for display,
// humanist sans for body, with Arabic counterparts that share the same
// contrast. All are downloaded at build time and served from /_next/static,
// so no request ever goes to Google at runtime.
export const displayLatin = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display-latin',
  display: 'swap',
})

export const bodyLatin = Manrope({
  subsets: ['latin'],
  variable: '--font-body-latin',
  display: 'swap',
})

export const displayArabic = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-display-arabic',
  display: 'swap',
})

export const bodyArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body-arabic',
  display: 'swap',
})

export const fontVariables = [
  displayLatin.variable,
  bodyLatin.variable,
  displayArabic.variable,
  bodyArabic.variable,
].join(' ')
