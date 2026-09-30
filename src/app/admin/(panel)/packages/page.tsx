import Link from 'next/link'
import { requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { Badge, EmptyState, LinkButton, PageHeader, Table } from '@/components/admin/ui'

export default async function PackagesPage() {
  await requireAdmin()
  const supabase = await createClient()
  const [{ data: packages, error }, { data: categories }] = await Promise.all([
    supabase.from('packages').select('id, category_id, tier, name_en, price_from_kwd, price_to_kwd, delivery_days_min, delivery_days_max, highlighted, published').order('sort_order'),
    supabase.from('categories').select('id, name_en, sort_order').order('sort_order'),
  ])
  if (error) throw error
  const groups = [{ id: null as string | null, name_en: 'Generic (all categories)' }, ...(categories ?? [])]
  return (
    <>
      <PageHeader title="Packages" description="Starter / Professional / Elite per category. Generic rows are the fallback." actions={<LinkButton href="/admin/packages/new" variant="primary">New package</LinkButton>} />
      {packages.length === 0 ? (
        <EmptyState title="No packages yet." />
      ) : (
        <div className="flex flex-col gap-8">
          {groups.map((g) => {
            const rows = packages.filter((p) => p.category_id === g.id)
            if (rows.length === 0) return null
            return (
              <section key={g.id ?? 'generic'}>
                <h2 className="mb-3 text-sm font-medium text-fg-muted">{g.name_en}</h2>
                <Table head={['Tier', 'Name', 'Price (KWD)', 'Delivery', 'Status']}>
                  {rows.map((r) => (
                    <tr key={r.id} className="hover:bg-surface-hover">
                      <td className="px-4 py-3 capitalize">{r.tier}{r.highlighted && <> <Badge tone="gold">Highlighted</Badge></>}</td>
                      <td className="px-4 py-3"><Link href={`/admin/packages/${r.id}`} className="font-medium hover:text-gold">{r.name_en}</Link></td>
                      <td className="px-4 py-3 tnum">{Number(r.price_from_kwd)} – {Number(r.price_to_kwd)}</td>
                      <td className="px-4 py-3 text-fg-muted tnum">{r.delivery_days_min}–{r.delivery_days_max} days</td>
                      <td className="px-4 py-3">{r.published ? <Badge tone="success">Published</Badge> : <Badge>Hidden</Badge>}</td>
                    </tr>
                  ))}
                </Table>
              </section>
            )
          })}
        </div>
      )}
    </>
  )
}
