import { DM_Sans, El_Messiri, Fraunces } from 'next/font/google'

export const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap', preload: false })
export const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', display: 'swap', preload: false })
export const elMessiri = El_Messiri({ subsets: ['arabic', 'latin'], variable: '--font-el-messiri', display: 'swap', preload: false })
export const sahwaFonts = `${fraunces.variable} ${dmSans.variable} ${elMessiri.variable}`
