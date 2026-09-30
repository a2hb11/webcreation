'use server'

import { z } from 'zod'
import { makeDelete, makeSave } from '@/lib/admin/crud'
import { checkbox, number, text, zInt, zText } from '@/lib/admin/form'
import type { ActionState } from '@/lib/admin/types'
import { cacheTags } from '@/lib/data/public'

const code = z.string().regex(/^[A-Z]{3}$/, 'three uppercase letters, e.g. USD')

const schema = z.object({
  code,
  existing: z.boolean(),
  name_en: zText(60),
  name_ar: zText(60),
  symbol: zText(8),
  symbol_ar: z.string().trim().max(8).optional().transform((v) => v ?? ''),
  rate_per_kwd: z.coerce.number().positive().max(100_000),
  rounding: z.coerce.number().positive().max(10_000),
  decimals: zInt(0, 3),
  is_default: z.boolean(),
  enabled: z.boolean(),
  sort_order: zInt(0, 10_000).default(0),
})

const save = makeSave({
  table: 'currencies',
  schema,
  omit: ['existing'],
  isUpdate: (d) => d.existing,
  tags: [cacheTags.currencies],
  route: '/admin/currencies',
  idColumn: 'code',
  uniqueMessage: 'A currency with this code already exists.',
  before: async (data, supabase) => {
    if (data.is_default) {
      const { error } = await supabase.from('currencies').update({ is_default: false }).neq('code', data.code).eq('is_default', true)
      if (error) return error.message
    } else if (!data.enabled) {
      const { data: current } = await supabase.from('currencies').select('is_default').eq('code', data.code).maybeSingle()
      if (current?.is_default) return 'The default currency cannot be disabled. Make another currency the default first.'
    }
    return null
  },
})

export async function saveCurrency(_prev: ActionState, fd: FormData): Promise<ActionState> {
  // Editing posts `code` (read-only field); creating posts `new_code`.
  const existing = text(fd, 'code') !== ''
  return save({
    code: text(fd, existing ? 'code' : 'new_code'),
    existing,
    name_en: text(fd, 'name_en'),
    name_ar: text(fd, 'name_ar'),
    symbol: text(fd, 'symbol'),
    symbol_ar: text(fd, 'symbol_ar'),
    rate_per_kwd: number(fd, 'rate_per_kwd'),
    rounding: number(fd, 'rounding'),
    decimals: number(fd, 'decimals'),
    is_default: checkbox(fd, 'is_default'),
    enabled: checkbox(fd, 'enabled'),
    sort_order: number(fd, 'sort_order'),
  })
}

export const deleteCurrency = makeDelete({
  table: 'currencies',
  tags: [cacheTags.currencies],
  route: '/admin/currencies',
  idColumn: 'code',
  idSchema: code,
  guard: async (id, supabase) => {
    const { data } = await supabase.from('currencies').select('is_default').eq('code', id).maybeSingle()
    return data?.is_default ? 'The default currency cannot be deleted.' : null
  },
})
