import { requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/admin/ui'
import { EntityForm } from '@/components/admin/entity-form'
import { saveProject } from '../actions'
import { projectRows } from '../fields'

export default async function NewProjectPage() {
  await requireAdmin()
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('id, name_en').order('sort_order')
  return (
    <>
      <PageHeader title="New project" description="Images can be added after the project is created." />
      <EntityForm rows={projectRows((categories ?? []).map((c) => ({ value: c.id, label: c.name_en })))} values={{ tier: 'starter', is_concept: true, published: false, sort_order: 0 }} action={saveProject} entityLabel="project" />
    </>
  )
}
