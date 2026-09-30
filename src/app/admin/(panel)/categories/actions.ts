'use server'

import { updateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { dbErrorMessage, runAdminAction, type ActionState } from '@/lib/admin/action'
import { checkbox, number, optional, text, zInt, zOptionalText, zSlug, zText, zUuid } from '@/lib/admin/form'
import { cacheTags } from '@/lib/data/public'

const categorySchema = z.object({
  id: zUuid.optional(),
  slug: zSlug,
  name_en: zText(120),
  name_ar: zText(120),
  description_en: zOptionalText(500),
  description_ar: zOptionalText(500),
  icon: zOptionalText(40).transform((v) => v || 'layout'),
  sort_order: zInt(0, 10_000).default(0),
  published: z.boolean(),
})

export async function saveCategory(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return runAdminAction(
    categorySchema,
    {
      id: optional(formData, 'id'),
      slug: text(formData, 'slug'),
      name_en: text(formData, 'name_en'),
      name_ar: text(formData, 'name_ar'),
      description_en: optional(formData, 'description_en'),
      description_ar: optional(formData, 'description_ar'),
      icon: optional(formData, 'icon'),
      sort_order: number(formData, 'sort_order'),
      published: checkbox(formData, 'published'),
    },
    async ({ id, ...values }, { supabase }) => {
      const query = id
        ? supabase.from('categories').update(values).eq('id', id)
        : supabase.from('categories').insert(values)
      const { data, error } = await query.select('id').single()
      if (error) return { status: 'error', message: dbErrorMessage(error) }

      updateTag(cacheTags.categories)
      updateTag(cacheTags.projects)
      if (!id) redirect(`/admin/categories/${data.id}?saved=1`)
      return { status: 'success', message: 'Saved.', id: data.id }
    },
  )
}

export async function deleteCategory(formData: FormData): Promise<void> {
  const result = await runAdminAction(
    z.object({ id: zUuid }),
    { id: text(formData, 'id') },
    async ({ id }, { supabase }) => {
      const { error } = await supabase.from('categories').delete().eq('id', id)
      if (error) return { status: 'error', message: dbErrorMessage(error) }
      updateTag(cacheTags.categories)
      updateTag(cacheTags.projects)
      updateTag(cacheTags.packages)
      return { status: 'success' }
    },
  )
  if (result.status === 'error') {
    redirect(`/admin/categories/${text(formData, 'id')}?error=${encodeURIComponent(result.message)}`)
  }
  redirect('/admin/categories')
}
