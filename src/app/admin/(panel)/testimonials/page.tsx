import Link from 'next/link'
import { requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { Badge, EmptyState, LinkButton, PageHeader, Table } from '@/components/admin/ui'

export default async function TestimonialsPage() {
  await requireAdmin()
  const supabase = await createClient()
  const { data, error } = await supabase.from('testimonials').select('id, author_name, author_role_en, published, sort_order, project:projects(title_en)').order('sort_order')
  if (error) throw error
  return (
    <>
      <PageHeader title="Testimonials" description="Only publish testimonials from real clients." actions={<LinkButton href="/admin/testimonials/new" variant="primary">New testimonial</LinkButton>} />
      {data.length === 0 ? (
        <EmptyState title="No testimonials yet — they appear on the site once real clients provide them." />
      ) : (
        <Table head={['Client', 'Role', 'Project', 'Order', 'Status']}>
          {data.map((r) => (
            <tr key={r.id} className="hover:bg-surface-hover">
              <td className="px-4 py-3"><Link href={`/admin/testimonials/${r.id}`} className="font-medium hover:text-gold">{r.author_name}</Link></td>
              <td className="px-4 py-3 text-fg-muted">{r.author_role_en}</td>
              <td className="px-4 py-3 text-fg-muted">{r.project?.title_en ?? '—'}</td>
              <td className="px-4 py-3 text-fg-muted">{r.sort_order}</td>
              <td className="px-4 py-3">{r.published ? <Badge tone="success">Published</Badge> : <Badge>Hidden</Badge>}</td>
            </tr>
          ))}
        </Table>
      )}
    </>
  )
}
