export type Family = 'oud' | 'musk' | 'amber' | 'floral'
export type Product = {
  slug: string
  en: string
  ar: string
  family: Family
  price50: number
  price100: number
  notes: { top: [string, string]; heart: [string, string]; base: [string, string] }
  hue: string
  preorder?: boolean
  rating: number
}

export const families: Record<Family, { en: string; ar: string }> = {
  oud: { en: 'Oud', ar: 'عود' },
  musk: { en: 'Musk', ar: 'مسك' },
  amber: { en: 'Amber', ar: 'عنبر' },
  floral: { en: 'Floral', ar: 'زهري' },
}

export const products: Product[] = [
  { slug: 'layl', en: 'Layl', ar: 'ليل', family: 'oud', price50: 38, price100: 62, notes: { top: ['Saffron', 'زعفران'], heart: ['Cambodian oud', 'عود كمبودي'], base: ['Leather', 'جلد'] }, hue: '#3b1f14', rating: 4.8 },
  { slug: 'sahar', en: 'Sahar', ar: 'سَحَر', family: 'musk', price50: 29, price100: 46, notes: { top: ['Pear', 'كمثرى'], heart: ['White musk', 'مسك أبيض'], base: ['Sandalwood', 'صندل'] }, hue: '#6b5a4a', rating: 4.6 },
  { slug: 'kahraman', en: 'Kahraman', ar: 'كهرمان', family: 'amber', price50: 34, price100: 55, notes: { top: ['Bergamot', 'برغموت'], heart: ['Labdanum', 'لابدانوم'], base: ['Amber', 'عنبر'] }, hue: '#8a5a1e', rating: 4.9 },
  { slug: 'nasim', en: 'Nasim', ar: 'نسيم', family: 'floral', price50: 27, price100: 42, notes: { top: ['Neroli', 'نيرولي'], heart: ['Taif rose', 'ورد طائفي'], base: ['Musk', 'مسك'] }, hue: '#7a3b4a', rating: 4.5 },
  { slug: 'dukhan', en: 'Dukhan', ar: 'دخان', family: 'oud', price50: 44, price100: 72, notes: { top: ['Incense', 'بخور'], heart: ['Smoked oud', 'عود مدخّن'], base: ['Vetiver', 'فيتيفر'] }, hue: '#2a2622', preorder: true, rating: 4.7 },
  { slug: 'raheeq', en: 'Raheeq', ar: 'رحيق', family: 'amber', price50: 31, price100: 50, notes: { top: ['Fig', 'تين'], heart: ['Vanilla', 'فانيلا'], base: ['Benzoin', 'بنزوين'] }, hue: '#9c6a2c', rating: 4.4 },
  { slug: 'thalj', en: 'Thalj', ar: 'ثلج', family: 'musk', price50: 26, price100: 41, notes: { top: ['Mint', 'نعناع'], heart: ['Cotton musk', 'مسك قطني'], base: ['Cedar', 'أرز'] }, hue: '#8d99a6', rating: 4.3 },
  { slug: 'ward', en: 'Ward', ar: 'ورد', family: 'floral', price50: 30, price100: 48, notes: { top: ['Pink pepper', 'فلفل وردي'], heart: ['Damask rose', 'ورد دمشقي'], base: ['Oud', 'عود'] }, hue: '#a0455a', rating: 4.8 },
]
