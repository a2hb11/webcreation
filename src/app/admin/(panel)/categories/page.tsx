import Link from 'next/link'
import { requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { Badge, EmptyState, LinkButton, PageHeader, Table } from '@/components/admin/ui'

export default async function CategoriesPage() {
  await requireAdmin()
  const supabase = await createClient()
  const { data: categories, error } = await supabase
    .from('categories')
    .select('id, slug, name_en, name_ar, published, sort_order')
    .order('sort_order')
  if (error) throw error

  return (
    <>
      <PageHeader
        title="Categories"
        description="The kinds of work shown on the site. Each has its own pricing tiers."
        actions={<LinkButton href="/admin/categories/new" variant="primary">New category</LinkButton>}
      />
      {categories.length === 0 ? (
        <EmptyState title="No categories yet." />
      ) : (
        <Table head={['Name', 'Arabic', 'Slug', 'Order', 'Status']}>
          {categories.map((c) => (
            <tr key={c.id} className="hover:bg-surface-hover">
              <td className="px-4 py-3">
                <Link href={`/admin/categories/${c.id}`} className="font-medium hover:text-gold">
                  {c.name_en}
                </Link>
              </td>
              <td className="px-4 py-3" dir="rtl">
                {c.name_ar}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-fg-muted">{c.slug}</td>
              <td className="px-4 py-3 text-fg-muted">{c.sort_order}</td>
              <td className="px-4 py-3">
                {c.published ? <Badge tone="success">Published</Badge> : <Badge>Hidden</Badge>}
              </td>
            </tr>
          ))}
        </Table>
      )}
    </>
  )
}
