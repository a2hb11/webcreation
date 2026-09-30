'use server'

import { z } from 'zod'
import { makeDelete, makeSave } from '@/lib/admin/crud'
import { bilingualLines, checkbox, number, optional, text, zBilingual, zInt, zMoney, zSlug, zText, zUuid } from '@/lib/admin/form'
import type { ActionState } from '@/lib/admin/types'
import { cacheTags } from '@/lib/data/public'

const schema = z.object({
  id: zUuid.optional(),
  slug: zSlug,
  name_en: zText(120),
  name_ar: zText(120),
  price_kwd_month: zMoney,
  includes: zBilingual,
  highlighted: z.boolean(),
  published: z.boolean(),
  sort_order: zInt(0, 10_000).default(0),
})

const save = makeSave({ table: 'maintenance_plans', schema, tags: [cacheTags.maintenance], route: '/admin/maintenance-plans' })

export async function saveMaintenancePlan(_prev: ActionState, fd: FormData): Promise<ActionState> {
  return save({
    id: optional(fd, 'id'),
    slug: text(fd, 'slug'),
    name_en: text(fd, 'name_en'),
    name_ar: text(fd, 'name_ar'),
    price_kwd_month: number(fd, 'price_kwd_month'),
    includes: bilingualLines(fd, 'includes'),
    highlighted: checkbox(fd, 'highlighted'),
    published: checkbox(fd, 'published'),
    sort_order: number(fd, 'sort_order'),
  })
}

export const deleteMaintenancePlan = makeDelete({ table: 'maintenance_plans', tags: [cacheTags.maintenance], route: '/admin/maintenance-plans' })
