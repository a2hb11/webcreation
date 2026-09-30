import { requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/admin/ui'
import { EntityForm } from '@/components/admin/entity-form'
import { saveTestimonial } from '../actions'
import { testimonialRows } from '../fields'

export default async function NewTestimonialPage() {
  await requireAdmin()
  const supabase = await createClient()
  const { data: projects } = await supabase.from('projects').select('id, title_en').order('sort_order')
  return (
    <>
      <PageHeader title="New testimonial" />
      <EntityForm rows={testimonialRows((projects ?? []).map((p) => ({ value: p.id, label: p.title_en })))} values={{ published: false, sort_order: 0 }} action={saveTestimonial} entityLabel="testimonial" />
    </>
  )
}
