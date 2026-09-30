import { Amiri, Cormorant_Garamond, IBM_Plex_Sans_Arabic, Inter } from 'next/font/google'

// Editorial serif for display, Inter for body; Amiri + IBM Plex Sans Arabic
// as the Arabic counterparts (same contrast, harmonious Latin glyphs). All
// are downloaded at build time and served from /_next/static, so no request
// goes to Google at runtime and `font-src 'self'` holds.
export const displayLatin = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display-latin',
  display: 'swap',
})

export const bodyLatin = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-body-latin',
  display: 'swap',
  axes: ['opsz'],
})

export const displayArabic = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-display-arabic',
  display: 'swap',
})

export const bodyArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body-arabic',
  display: 'swap',
})

export const fontVariables = [
  displayLatin.variable,
  bodyLatin.variable,
  displayArabic.variable,
  bodyArabic.variable,
].join(' ')
