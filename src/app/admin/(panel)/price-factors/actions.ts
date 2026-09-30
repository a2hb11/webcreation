'use server'

import { z } from 'zod'
import { makeDelete, makeSave } from '@/lib/admin/crud'
import { checkbox, number, optional, text, zInt, zMoney, zOptionalText, zSlug, zText, zUuid } from '@/lib/admin/form'
import type { ActionState } from '@/lib/admin/types'
import { cacheTags } from '@/lib/data/public'

const schema = z
  .object({
    id: zUuid.optional(),
    slug: zSlug,
    name_en: zText(120),
    name_ar: zText(120),
    description_en: zOptionalText(500),
    description_ar: zOptionalText(500),
    example_en: zOptionalText(300),
    example_ar: zOptionalText(300),
    delta_from_kwd: zMoney,
    delta_to_kwd: zMoney,
    pricing_mode: z.enum(['flat', 'per_unit', 'percent']),
    unit_label_en: z.string().trim().max(40).optional().transform((v) => v || null),
    unit_label_ar: z.string().trim().max(40).optional().transform((v) => v || null),
    max_units: z.coerce.number().int().min(1).max(100_000).optional().nullable(),
    in_calculator: z.boolean(),
    published: z.boolean(),
    sort_order: zInt(0, 10_000).default(0),
  })
  .refine((d) => d.delta_to_kwd >= d.delta_from_kwd, { path: ['delta_to_kwd'], message: 'must be ≥ the "from" value' })
  .refine((d) => d.pricing_mode !== 'per_unit' || (d.unit_label_en && d.unit_label_ar), {
    path: ['unit_label_en'],
    message: 'unit labels are required for per-unit factors',
  })

const save = makeSave({ table: 'price_factors', schema, tags: [cacheTags.factors], route: '/admin/price-factors' })

export async function savePriceFactor(_prev: ActionState, fd: FormData): Promise<ActionState> {
  return save({
    id: optional(fd, 'id'),
    slug: text(fd, 'slug'),
    name_en: text(fd, 'name_en'),
    name_ar: text(fd, 'name_ar'),
    description_en: optional(fd, 'description_en'),
    description_ar: optional(fd, 'description_ar'),
    example_en: optional(fd, 'example_en'),
    example_ar: optional(fd, 'example_ar'),
    delta_from_kwd: number(fd, 'delta_from_kwd'),
    delta_to_kwd: number(fd, 'delta_to_kwd'),
    pricing_mode: text(fd, 'pricing_mode'),
    unit_label_en: optional(fd, 'unit_label_en'),
    unit_label_ar: optional(fd, 'unit_label_ar'),
    max_units: number(fd, 'max_units') ?? null,
    in_calculator: checkbox(fd, 'in_calculator'),
    published: checkbox(fd, 'published'),
    sort_order: number(fd, 'sort_order'),
  })
}

export const deletePriceFactor = makeDelete({ table: 'price_factors', tags: [cacheTags.factors], route: '/admin/price-factors' })
