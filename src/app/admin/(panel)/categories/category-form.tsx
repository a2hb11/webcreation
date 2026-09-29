'use client'

import { useActionState } from 'react'
import { deleteCategory, saveCategory } from './actions'
import { idle, type ActionState } from '@/lib/admin/types'
import { Button, Checkbox, Field, FormMessage, Input, Textarea } from '@/components/admin/ui'
import type { Category } from '@/lib/data/public'

export function CategoryForm({ category, notice }: { category?: Category; notice?: ActionState }) {
  const [state, action, pending] = useActionState(saveCategory, notice ?? idle)
  const err = state.status === 'error' ? state.fields : undefined

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
      <form action={action} className="flex flex-col gap-5">
        {category && <input type="hidden" name="id" value={category.id} />}
        <FormMessage state={state} />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Name (English)" error={err?.name_en}>
            <Input name="name_en" defaultValue={category?.name_en} required maxLength={120} />
          </Field>
          <Field label="Name (Arabic)" error={err?.name_ar}>
            <Input name="name_ar" defaultValue={category?.name_ar} required maxLength={120} dir="rtl" />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Description (English)" error={err?.description_en}>
            <Textarea name="description_en" defaultValue={category?.description_en} maxLength={500} rows={3} />
          </Field>
          <Field label="Description (Arabic)" error={err?.description_ar}>
            <Textarea name="description_ar" defaultValue={category?.description_ar} maxLength={500} rows={3} dir="rtl" />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Slug" hint="Used in the URL, e.g. online-stores" error={err?.slug}>
            <Input name="slug" defaultValue={category?.slug} required pattern="[a-z0-9]+(-[a-z0-9]+)*" />
          </Field>
          <Field label="Icon" hint="Lucide icon name" error={err?.icon}>
            <Input name="icon" defaultValue={category?.icon ?? 'layout'} maxLength={40} />
          </Field>
          <Field label="Sort order" error={err?.sort_order}>
            <Input name="sort_order" type="number" min={0} defaultValue={category?.sort_order ?? 0} />
          </Field>
        </div>

        <Checkbox name="published" label="Published (visible on the site)" defaultChecked={category?.published ?? true} />

        <div className="flex gap-3">
          <Button type="submit" disabled={pending}>
            {pending ? 'Saving…' : category ? 'Save changes' : 'Create category'}
          </Button>
        </div>
      </form>

      {category && (
        <aside className="flex flex-col gap-3 rounded-lg border border-border p-4 text-sm">
          <p className="font-medium">Danger zone</p>
          <p className="text-fg-muted">
            Deleting a category is blocked while projects still use it. Packages for this category are
            removed with it.
          </p>
          <form
            action={deleteCategory}
            onSubmit={(e) => {
              if (!confirm(`Delete "${category.name_en}"?`)) e.preventDefault()
            }}
          >
            <input type="hidden" name="id" value={category.id} />
            <Button type="submit" variant="danger">
              Delete category
            </Button>
          </form>
        </aside>
      )}
    </div>
  )
}
