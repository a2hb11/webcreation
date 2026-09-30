import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { isUuid, noticeFrom } from '@/lib/admin/crud'
import { toBilingualLines } from '@/lib/admin/form'
import { PageHeader } from '@/components/admin/ui'
import { EntityForm } from '@/components/admin/entity-form'
import { deletePackage, savePackage } from '../actions'
import { packageRows } from '../fields'

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string; error?: string }> }

export default async function EditPackagePage({ params, searchParams }: Props) {
  await requireAdmin()
  const { id } = await params
  if (!isUuid(id)) notFound()
  const supabase = await createClient()
  const [{ data: row }, { data: categories }] = await Promise.all([
    supabase.from('packages').select('*').eq('id', id).maybeSingle(),
    supabase.from('categories').select('id, name_en').order('sort_order'),
  ])
  if (!row) notFound()
  return (
    <>
      <PageHeader title={`${row.name_en} · ${row.tier}`} />
      <EntityForm
        rows={packageRows((categories ?? []).map((c) => ({ value: c.id, label: c.name_en })))}
        values={{ ...row, category_id: row.category_id ?? '', includes: toBilingualLines(row.includes) }}
        id={row.id}
        action={savePackage}
        deleteAction={deletePackage}
        entityLabel="package"
        notice={noticeFrom(await searchParams)}
      />
    </>
  )
}
