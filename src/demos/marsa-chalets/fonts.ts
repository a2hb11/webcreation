import { Almarai, Lora, Nunito } from 'next/font/google'

export const lora = Lora({ subsets: ['latin'], variable: '--font-lora', display: 'swap', preload: false })
export const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito', display: 'swap', preload: false })
export const almarai = Almarai({ subsets: ['arabic'], weight: ['400', '700', '800'], variable: '--font-almarai', display: 'swap', preload: false })
export const marsaFonts = `${lora.variable} ${nunito.variable} ${almarai.variable}`
