import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { isUuid, noticeFrom } from '@/lib/admin/crud'
import { PageHeader } from '@/components/admin/ui'
import { EntityForm } from '@/components/admin/entity-form'
import { deletePriceFactor, savePriceFactor } from '../actions'
import { factorRows } from '../fields'

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string; error?: string }> }

export default async function EditFactorPage({ params, searchParams }: Props) {
  await requireAdmin()
  const { id } = await params
  if (!isUuid(id)) notFound()
  const supabase = await createClient()
  const { data: row } = await supabase.from('price_factors').select('*').eq('id', id).maybeSingle()
  if (!row) notFound()
  return (
    <>
      <PageHeader title={row.name_en} description={row.slug} />
      <EntityForm rows={factorRows} values={row} id={row.id} action={savePriceFactor} deleteAction={deletePriceFactor} entityLabel="factor" notice={noticeFrom(await searchParams)} />
    </>
  )
}
