import { requireAdmin } from '@/lib/auth/admin'
import { PageHeader } from '@/components/admin/ui'
import { CategoryForm } from '../category-form'

export default async function NewCategoryPage() {
  await requireAdmin()
  return (
    <>
      <PageHeader title="New category" />
      <CategoryForm />
    </>
  )
}
