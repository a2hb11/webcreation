import { requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/admin/ui'
import { EntityForm } from '@/components/admin/entity-form'
import { savePackage } from '../actions'
import { packageRows } from '../fields'

export default async function NewPackagePage() {
  await requireAdmin()
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('id, name_en').order('sort_order')
  return (
    <>
      <PageHeader title="New package" />
      <EntityForm rows={packageRows((categories ?? []).map((c) => ({ value: c.id, label: c.name_en })))} values={{ tier: 'starter', published: true, sort_order: 0, delivery_days_min: 7, delivery_days_max: 14 }} action={savePackage} entityLabel="package" />
    </>
  )
}
