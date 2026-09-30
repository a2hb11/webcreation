import { requireAdmin } from '@/lib/auth/admin'
import { PageHeader } from '@/components/admin/ui'
import { EntityForm } from '@/components/admin/entity-form'
import { savePriceFactor } from '../actions'
import { factorRows } from '../fields'

export default async function NewFactorPage() {
  await requireAdmin()
  return (
    <>
      <PageHeader title="New price factor" />
      <EntityForm rows={factorRows} values={{ pricing_mode: 'flat', in_calculator: true, published: true, sort_order: 0 }} action={savePriceFactor} entityLabel="factor" />
    </>
  )
}
