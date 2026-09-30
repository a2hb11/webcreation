import Link from 'next/link'
import { requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { Badge, EmptyState, LinkButton, PageHeader, Table } from '@/components/admin/ui'

const modeLabel = { flat: 'flat', per_unit: 'per unit', percent: 'percent' } as Record<string, string>

export default async function PriceFactorsPage() {
  await requireAdmin()
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('price_factors')
    .select('id, name_en, name_ar, delta_from_kwd, delta_to_kwd, pricing_mode, unit_label_en, in_calculator, published, sort_order')
    .order('sort_order')
  if (error) throw error
  return (
    <>
      <PageHeader title="Price factors" description="What pushes a quote up. Shown on the pricing page and used by the calculator." actions={<LinkButton href="/admin/price-factors/new" variant="primary">New factor</LinkButton>} />
      {data.length === 0 ? (
        <EmptyState title="No factors yet." />
      ) : (
        <Table head={['Factor', 'Arabic', 'Adds', 'Mode', 'Calculator', 'Status']}>
          {data.map((r) => (
            <tr key={r.id} className="hover:bg-surface-hover">
              <td className="px-4 py-3"><Link href={`/admin/price-factors/${r.id}`} className="font-medium hover:text-gold">{r.name_en}</Link></td>
              <td className="px-4 py-3" dir="rtl">{r.name_ar}</td>
              <td className="px-4 py-3 tnum">
                {r.pricing_mode === 'percent' ? `${Number(r.delta_from_kwd)} – ${Number(r.delta_to_kwd)} %` : `KD ${Number(r.delta_from_kwd)} – ${Number(r.delta_to_kwd)}`}
                {r.pricing_mode === 'per_unit' && r.unit_label_en ? ` / ${r.unit_label_en}` : ''}
              </td>
              <td className="px-4 py-3"><Badge>{modeLabel[r.pricing_mode] ?? r.pricing_mode}</Badge></td>
              <td className="px-4 py-3 text-fg-muted">{r.in_calculator ? 'yes' : '—'}</td>
              <td className="px-4 py-3">{r.published ? <Badge tone="success">Published</Badge> : <Badge>Hidden</Badge>}</td>
            </tr>
          ))}
        </Table>
      )}
    </>
  )
}
