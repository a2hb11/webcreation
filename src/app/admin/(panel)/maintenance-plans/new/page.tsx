import { requireAdmin } from '@/lib/auth/admin'
import { PageHeader } from '@/components/admin/ui'
import { EntityForm } from '@/components/admin/entity-form'
import { saveMaintenancePlan } from '../actions'
import { planRows } from '../fields'

export default async function NewPlanPage() {
  await requireAdmin()
  return (
    <>
      <PageHeader title="New maintenance plan" />
      <EntityForm rows={planRows} values={{ published: true, sort_order: 0 }} action={saveMaintenancePlan} entityLabel="plan" />
    </>
  )
}
