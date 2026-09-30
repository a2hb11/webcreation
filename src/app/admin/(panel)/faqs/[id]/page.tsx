import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { isUuid, noticeFrom } from '@/lib/admin/crud'
import { PageHeader } from '@/components/admin/ui'
import { EntityForm } from '@/components/admin/entity-form'
import { deleteFaq, saveFaq } from '../actions'
import { faqRows } from '../fields'

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string; error?: string }> }

export default async function EditFaqPage({ params, searchParams }: Props) {
  await requireAdmin()
  const { id } = await params
  if (!isUuid(id)) notFound()
  const supabase = await createClient()
  const { data: row } = await supabase.from('faqs').select('*').eq('id', id).maybeSingle()
  if (!row) notFound()
  return (
    <>
      <PageHeader title={row.question_en} />
      <EntityForm rows={faqRows} values={row} id={row.id} action={saveFaq} deleteAction={deleteFaq} entityLabel="FAQ" notice={noticeFrom(await searchParams)} />
    </>
  )
}
