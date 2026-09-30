'use server'

import { z } from 'zod'
import { makeDelete, makeSave } from '@/lib/admin/crud'
import { checkbox, number, optional, text, zInt, zOptionalText, zText, zUuid } from '@/lib/admin/form'
import type { ActionState } from '@/lib/admin/types'
import { cacheTags } from '@/lib/data/public'

const schema = z.object({
  id: zUuid.optional(),
  author_name: zText(120),
  author_role_en: zOptionalText(120),
  author_role_ar: zOptionalText(120),
  quote_en: zText(1000),
  quote_ar: zText(1000),
  project_id: z.union([z.literal(''), zUuid]).transform((v) => v || null),
  published: z.boolean(),
  sort_order: zInt(0, 10_000).default(0),
})

const save = makeSave({ table: 'testimonials', schema, tags: [cacheTags.testimonials], route: '/admin/testimonials' })

export async function saveTestimonial(_prev: ActionState, fd: FormData): Promise<ActionState> {
  return save({
    id: optional(fd, 'id'),
    author_name: text(fd, 'author_name'),
    author_role_en: optional(fd, 'author_role_en'),
    author_role_ar: optional(fd, 'author_role_ar'),
    quote_en: text(fd, 'quote_en'),
    quote_ar: text(fd, 'quote_ar'),
    project_id: text(fd, 'project_id'),
    published: checkbox(fd, 'published'),
    sort_order: number(fd, 'sort_order'),
  })
}

export const deleteTestimonial = makeDelete({ table: 'testimonials', tags: [cacheTags.testimonials], route: '/admin/testimonials' })
