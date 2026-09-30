import Link from 'next/link'
import { requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { Badge, EmptyState, LinkButton, PageHeader, Table } from '@/components/admin/ui'

export default async function FaqsPage() {
  await requireAdmin()
  const supabase = await createClient()
  const { data, error } = await supabase.from('faqs').select('id, question_en, question_ar, published, sort_order').order('sort_order')
  if (error) throw error
  return (
    <>
      <PageHeader title="FAQs" description="Shown on the home and pricing pages." actions={<LinkButton href="/admin/faqs/new" variant="primary">New FAQ</LinkButton>} />
      {data.length === 0 ? (
        <EmptyState title="No FAQs yet." />
      ) : (
        <Table head={['Question', 'Arabic', 'Order', 'Status']}>
          {data.map((r) => (
            <tr key={r.id} className="hover:bg-surface-hover">
              <td className="px-4 py-3"><Link href={`/admin/faqs/${r.id}`} className="font-medium hover:text-gold">{r.question_en}</Link></td>
              <td className="px-4 py-3" dir="rtl">{r.question_ar}</td>
              <td className="px-4 py-3 text-fg-muted">{r.sort_order}</td>
              <td className="px-4 py-3">{r.published ? <Badge tone="success">Published</Badge> : <Badge>Hidden</Badge>}</td>
            </tr>
          ))}
        </Table>
      )}
    </>
  )
}
