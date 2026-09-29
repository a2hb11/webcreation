import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/admin/ui'
import type { ActionState } from '@/lib/admin/types'
import { CategoryForm } from '../category-form'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ saved?: string; error?: string }>
}

export default async function EditCategoryPage({ params, searchParams }: Props) {
  await requireAdmin()
  const { id } = await params
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound()

  const supabase = await createClient()
  const { data: category } = await supabase.from('categories').select('*').eq('id', id).maybeSingle()
  if (!category) notFound()

  const { saved, error } = await searchParams
  const notice: ActionState | undefined = error
    ? { status: 'error', message: error }
    : saved
      ? { status: 'success', message: 'Created.' }
      : undefined

  return (
    <>
      <PageHeader title={category.name_en} description={`/${category.slug}`} />
      <CategoryForm category={category} notice={notice} />
    </>
  )
}
