import Link from 'next/link'
import { requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { Badge, EmptyState, LinkButton, PageHeader, Table } from '@/components/admin/ui'

export default async function MaintenancePlansPage() {
  await requireAdmin()
  const supabase = await createClient()
  const { data, error } = await supabase.from('maintenance_plans').select('id, name_en, name_ar, price_kwd_month, highlighted, published, sort_order').order('sort_order')
  if (error) throw error
  return (
    <>
      <PageHeader title="Maintenance plans" description="Monthly care plans offered after launch." actions={<LinkButton href="/admin/maintenance-plans/new" variant="primary">New plan</LinkButton>} />
      {data.length === 0 ? (
        <EmptyState title="No plans yet." />
      ) : (
        <Table head={['Name', 'Arabic', 'Monthly', 'Order', 'Status']}>
          {data.map((r) => (
            <tr key={r.id} className="hover:bg-surface-hover">
              <td className="px-4 py-3"><Link href={`/admin/maintenance-plans/${r.id}`} className="font-medium hover:text-gold">{r.name_en}</Link>{r.highlighted && <Badge tone="gold">Highlighted</Badge>}</td>
              <td className="px-4 py-3" dir="rtl">{r.name_ar}</td>
              <td className="px-4 py-3 tnum">KD {Number(r.price_kwd_month)}</td>
              <td className="px-4 py-3 text-fg-muted">{r.sort_order}</td>
              <td className="px-4 py-3">{r.published ? <Badge tone="success">Published</Badge> : <Badge>Hidden</Badge>}</td>
            </tr>
          ))}
        </Table>
      )}
    </>
  )
}
