import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { isUuid, noticeFrom } from '@/lib/admin/crud'
import { toBilingualLines } from '@/lib/admin/form'
import { PageHeader } from '@/components/admin/ui'
import { EntityForm } from '@/components/admin/entity-form'
import { deleteMaintenancePlan, saveMaintenancePlan } from '../actions'
import { planRows } from '../fields'

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string; error?: string }> }

export default async function EditPlanPage({ params, searchParams }: Props) {
  await requireAdmin()
  const { id } = await params
  if (!isUuid(id)) notFound()
  const supabase = await createClient()
  const { data: row } = await supabase.from('maintenance_plans').select('*').eq('id', id).maybeSingle()
  if (!row) notFound()
  return (
    <>
      <PageHeader title={row.name_en} description={row.slug} />
      <EntityForm rows={planRows} values={{ ...row, includes: toBilingualLines(row.includes) }} id={row.id} action={saveMaintenancePlan} deleteAction={deleteMaintenancePlan} entityLabel="plan" notice={noticeFrom(await searchParams)} />
    </>
  )
}
