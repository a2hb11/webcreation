import { requireAdmin } from '@/lib/auth/admin'
import { PageHeader } from '@/components/admin/ui'
import { EntityForm } from '@/components/admin/entity-form'
import { saveCurrency } from '../actions'
import { currencyRows } from '../fields'

export default async function NewCurrencyPage() {
  await requireAdmin()
  return (
    <>
      <PageHeader title="New currency" />
      <EntityForm rows={currencyRows(false)} values={{ rounding: 1, decimals: 0, enabled: true, sort_order: 0 }} action={saveCurrency} entityLabel="currency" />
    </>
  )
}
