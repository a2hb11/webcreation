import { Karla, Marcellus, Reem_Kufi } from 'next/font/google'

export const marcellus = Marcellus({ subsets: ['latin'], weight: '400', variable: '--font-marcellus', display: 'swap', preload: false })
export const karla = Karla({ subsets: ['latin'], variable: '--font-karla', display: 'swap', preload: false })
export const reemKufi = Reem_Kufi({ subsets: ['arabic', 'latin'], variable: '--font-reem-kufi', display: 'swap', preload: false })
export const miskFonts = `${marcellus.variable} ${karla.variable} ${reemKufi.variable}`
