'use server'

import { cookies } from 'next/headers'
import { z } from 'zod'
import { getCurrencies } from '@/lib/data/public'

const year = 60 * 60 * 24 * 365
const base = { path: '/', maxAge: year, sameSite: 'lax' as const, secure: process.env.NODE_ENV === 'production' }

export async function setCurrency(code: string): Promise<void> {
  const parsed = z.string().regex(/^[A-Z]{3}$/).safeParse(code)
  if (!parsed.success) return
  const allowed = (await getCurrencies()).some((c) => c.code === parsed.data)
  if (!allowed) return
  ;(await cookies()).set('currency', parsed.data, base)
}

export async function setTheme(theme: string): Promise<void> {
  if (theme !== 'light' && theme !== 'dark') return
  ;(await cookies()).set('theme', theme, base)
}
