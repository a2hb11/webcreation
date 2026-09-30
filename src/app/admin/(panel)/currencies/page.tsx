import Link from 'next/link'
import type { Route } from 'next'
import { requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { Badge, EmptyState, LinkButton, PageHeader, Table } from '@/components/admin/ui'

export default async function CurrenciesPage() {
  await requireAdmin()
  const supabase = await createClient()
  const { data, error } = await supabase.from('currencies').select('*').order('sort_order')
  if (error) throw error
  return (
    <>
      <PageHeader
        title="Currencies"
        description="Prices are stored in KWD and converted with these fixed rates: display = round(kwd × rate, step)."
        actions={<LinkButton href="/admin/currencies/new" variant="primary">New currency</LinkButton>}
      />
      {data.length === 0 ? (
        <EmptyState title="No currencies yet." />
      ) : (
        <Table head={['Code', 'Name', 'Symbols', 'Per 1 KWD', 'Step', 'Decimals', 'Status']}>
          {data.map((r) => (
            <tr key={r.code} className="hover:bg-surface-hover">
              <td className="px-4 py-3 font-mono"><Link href={`/admin/currencies/${r.code}` as Route} className="font-medium hover:text-gold">{r.code}</Link>{r.is_default && <> <Badge tone="gold">Default</Badge></>}</td>
              <td className="px-4 py-3">{r.name_en} <span className="text-fg-muted" dir="rtl">{r.name_ar}</span></td>
              <td className="px-4 py-3">{r.symbol} <span className="text-fg-muted">{r.symbol_ar}</span></td>
              <td className="px-4 py-3 tnum">{Number(r.rate_per_kwd)}</td>
              <td className="px-4 py-3 tnum">{Number(r.rounding)}</td>
              <td className="px-4 py-3 tnum">{r.decimals}</td>
              <td className="px-4 py-3">{r.enabled ? <Badge tone="success">Enabled</Badge> : <Badge>Disabled</Badge>}</td>
            </tr>
          ))}
        </Table>
      )}
    </>
  )
}
