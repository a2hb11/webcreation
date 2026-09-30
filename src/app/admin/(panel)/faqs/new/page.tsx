import { requireAdmin } from '@/lib/auth/admin'
import { PageHeader } from '@/components/admin/ui'
import { EntityForm } from '@/components/admin/entity-form'
import { saveFaq } from '../actions'
import { faqRows } from '../fields'

export default async function NewFaqPage() {
  await requireAdmin()
  return (
    <>
      <PageHeader title="New FAQ" />
      <EntityForm rows={faqRows} values={{ published: true, sort_order: 0 }} action={saveFaq} entityLabel="FAQ" />
    </>
  )
}
