import { Changa, Space_Grotesk, Unbounded } from 'next/font/google'

export const unbounded = Unbounded({ subsets: ['latin'], weight: ['500', '700'], variable: '--font-unbounded', display: 'swap', preload: false })
export const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk', display: 'swap', preload: false })
export const changa = Changa({ subsets: ['arabic', 'latin'], weight: ['400', '600', '700'], variable: '--font-changa', display: 'swap', preload: false })
export const barqFonts = `${unbounded.variable} ${spaceGrotesk.variable} ${changa.variable}`
