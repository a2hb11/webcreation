import { z } from 'zod'

// FormData -> plain object helpers shared by every admin form. Empty strings
// become `undefined` for optional fields so zod defaults apply.

export const text = (fd: FormData, key: string) => {
  const v = fd.get(key)
  return typeof v === 'string' ? v.trim() : ''
}
export const optional = (fd: FormData, key: string) => text(fd, key) || undefined
export const checkbox = (fd: FormData, key: string) => fd.get(key) === 'on'
export const number = (fd: FormData, key: string) => {
  const v = text(fd, key)
  return v === '' ? undefined : Number(v)
}

// Bilingual lists are edited as one "English | العربية" pair per line.
export function bilingualLines(fd: FormData, key: string): { en: string; ar: string }[] {
  return text(fd, key)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [en = '', ar = ''] = line.split('|').map((s) => s.trim())
      return { en, ar: ar || en }
    })
}

export function toBilingualLines(items: unknown): string {
  if (!Array.isArray(items)) return ''
  return items
    .map((item) => {
      const en = typeof item?.en === 'string' ? item.en : ''
      const ar = typeof item?.ar === 'string' ? item.ar : ''
      return ar && ar !== en ? `${en} | ${ar}` : en
    })
    .join('\n')
}

export const zSlug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'lowercase letters, numbers and dashes only')
  .min(2)
  .max(80)
export const zUuid = z.uuid()
export const zText = (max = 200) => z.string().trim().min(1).max(max)
export const zOptionalText = (max = 200) =>
  z.string().trim().max(max).optional().transform((v) => v || '')
export const zMoney = z.coerce.number().min(0).max(1_000_000)
export const zInt = (min = 0, max = 1_000_000) => z.coerce.number().int().min(min).max(max)
export const zBilingual = z.array(z.object({ en: z.string().max(300), ar: z.string().max(300) })).max(40)
