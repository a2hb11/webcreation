import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { isUuid, noticeFrom } from '@/lib/admin/crud'
import { PageHeader } from '@/components/admin/ui'
import { EntityForm } from '@/components/admin/entity-form'
import { deleteTestimonial, saveTestimonial } from '../actions'
import { testimonialRows } from '../fields'

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string; error?: string }> }

export default async function EditTestimonialPage({ params, searchParams }: Props) {
  await requireAdmin()
  const { id } = await params
  if (!isUuid(id)) notFound()
  const supabase = await createClient()
  const [{ data: row }, { data: projects }] = await Promise.all([
    supabase.from('testimonials').select('*').eq('id', id).maybeSingle(),
    supabase.from('projects').select('id, title_en').order('sort_order'),
  ])
  if (!row) notFound()
  return (
    <>
      <PageHeader title={row.author_name} />
      <EntityForm rows={testimonialRows((projects ?? []).map((p) => ({ value: p.id, label: p.title_en })))} values={{ ...row, project_id: row.project_id ?? '' }} id={row.id} action={saveTestimonial} deleteAction={deleteTestimonial} entityLabel="testimonial" notice={noticeFrom(await searchParams)} />
    </>
  )
}
