'use server'

import { z } from 'zod'
import { makeDelete, makeSave } from '@/lib/admin/crud'
import { checkbox, number, optional, text, zInt, zText, zUuid } from '@/lib/admin/form'
import type { ActionState } from '@/lib/admin/types'
import { cacheTags } from '@/lib/data/public'

const schema = z.object({
  id: zUuid.optional(),
  question_en: zText(300),
  question_ar: zText(300),
  answer_en: zText(2000),
  answer_ar: zText(2000),
  sort_order: zInt(0, 10_000).default(0),
  published: z.boolean(),
})

const save = makeSave({
  table: 'faqs',
  schema,
  tags: [cacheTags.faqs],
  route: '/admin/faqs',
  uniqueMessage: 'A FAQ with this English question already exists.',
})

export async function saveFaq(_prev: ActionState, fd: FormData): Promise<ActionState> {
  return save({
    id: optional(fd, 'id'),
    question_en: text(fd, 'question_en'),
    question_ar: text(fd, 'question_ar'),
    answer_en: text(fd, 'answer_en'),
    answer_ar: text(fd, 'answer_ar'),
    sort_order: number(fd, 'sort_order'),
    published: checkbox(fd, 'published'),
  })
}

export const deleteFaq = makeDelete({ table: 'faqs', tags: [cacheTags.faqs], route: '/admin/faqs' })
