'use server'

import { z } from 'zod'
import { makeDelete, makeSave } from '@/lib/admin/crud'
import { bilingualLines, checkbox, number, optional, text, zBilingual, zInt, zMoney, zOptionalText, zText, zUuid } from '@/lib/admin/form'
import type { ActionState } from '@/lib/admin/types'
import { cacheTags } from '@/lib/data/public'

const schema = z
  .object({
    id: zUuid.optional(),
    category_id: z.union([z.literal(''), zUuid]).transform((v) => v || null),
    tier: z.enum(['starter', 'professional', 'elite']),
    name_en: zText(120),
    name_ar: zText(120),
    tagline_en: zOptionalText(160),
    tagline_ar: zOptionalText(160),
    price_from_kwd: zMoney,
    price_to_kwd: zMoney,
    delivery_days_min: zInt(1, 1000),
    delivery_days_max: zInt(1, 1000),
    includes: zBilingual,
    highlighted: z.boolean(),
    published: z.boolean(),
    sort_order: zInt(0, 10_000).default(0),
  })
  .refine((d) => d.price_to_kwd >= d.price_from_kwd, { path: ['price_to_kwd'], message: 'must be ≥ the "from" price' })
  .refine((d) => d.delivery_days_max >= d.delivery_days_min, { path: ['delivery_days_max'], message: 'must be ≥ the minimum' })

const save = makeSave({
  table: 'packages',
  schema,
  tags: [cacheTags.packages],
  route: '/admin/packages',
  uniqueMessage: 'A package for this category and tier already exists.',
})

export async function savePackage(_prev: ActionState, fd: FormData): Promise<ActionState> {
  return save({
    id: optional(fd, 'id'),
    category_id: text(fd, 'category_id'),
    tier: text(fd, 'tier'),
    name_en: text(fd, 'name_en'),
    name_ar: text(fd, 'name_ar'),
    tagline_en: optional(fd, 'tagline_en'),
    tagline_ar: optional(fd, 'tagline_ar'),
    price_from_kwd: number(fd, 'price_from_kwd'),
    price_to_kwd: number(fd, 'price_to_kwd'),
    delivery_days_min: number(fd, 'delivery_days_min'),
    delivery_days_max: number(fd, 'delivery_days_max'),
    includes: bilingualLines(fd, 'includes'),
    highlighted: checkbox(fd, 'highlighted'),
    published: checkbox(fd, 'published'),
    sort_order: number(fd, 'sort_order'),
  })
}

export const deletePackage = makeDelete({ table: 'packages', tags: [cacheTags.packages], route: '/admin/packages' })
