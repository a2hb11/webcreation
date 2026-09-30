import Link from 'next/link'
import type { Route } from 'next'
import { requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { fmtDateTime } from '@/lib/admin/format'
import { Badge, EmptyState, PageHeader, Table } from '@/components/admin/ui'
import type { Database } from '@/lib/supabase/database.types'

type Status = Database['public']['Enums']['inquiry_status']
const FILTERS = ['active', 'new', 'contacted', 'won', 'lost', 'spam', 'all'] as const
const tone: Record<Status, 'neutral' | 'gold' | 'success' | 'error'> = { new: 'gold', contacted: 'neutral', won: 'success', lost: 'neutral', spam: 'error' }

export default async function InquiriesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireAdmin()
  const { status } = await searchParams
  const filter = (FILTERS as readonly string[]).includes(status ?? '') ? (status as (typeof FILTERS)[number]) : 'active'

  const supabase = await createClient()
  let query = supabase
    .from('inquiries')
    .select('id, created_at, name, company, email, phone, source, tier, status, estimate_from_kwd, estimate_to_kwd, notified_email_at, notified_whatsapp_at, category:categories(name_en)')
    .order('created_at', { ascending: false })
    .limit(100)
  if (filter === 'active') query = query.neq('status', 'spam')
  else if (filter !== 'all') query = query.eq('status', filter)
  const { data, error } = await query
  if (error) throw error

  return (
    <>
      <PageHeader title="Inquiries" description="Contact, quote and calculator submissions. Showing the latest 100." />
      <nav className="mb-4 flex flex-wrap gap-2 text-sm">
        {FILTERS.map((f) => (
          <Link key={f} href={`/admin/inquiries?status=${f}` as Route} className={`rounded-full border px-3 py-1 capitalize ${f === filter ? 'border-gold text-gold' : 'border-border text-fg-muted hover:text-fg'}`}>
            {f}
          </Link>
        ))}
      </nav>
      {data.length === 0 ? (
        <EmptyState title="Nothing here." />
      ) : (
        <Table head={['Received', 'From', 'Contact', 'Source', 'Category · tier', 'Estimate', 'Sent', 'Status']}>
          {data.map((r) => (
            <tr key={r.id} className="hover:bg-surface-hover">
              <td className="px-4 py-3 whitespace-nowrap text-fg-muted tnum">{fmtDateTime(r.created_at)}</td>
              <td className="px-4 py-3"><Link href={`/admin/inquiries/${r.id}`} className="font-medium hover:text-gold">{r.name}</Link>{r.company && <div className="text-xs text-fg-muted">{r.company}</div>}</td>
              <td className="px-4 py-3 text-fg-muted" dir="ltr">{r.email ?? r.phone ?? '—'}</td>
              <td className="px-4 py-3 capitalize text-fg-muted">{r.source}</td>
              <td className="px-4 py-3 text-fg-muted">{r.category?.name_en ?? '—'}{r.tier ? ` · ${r.tier}` : ''}</td>
              <td className="px-4 py-3 tnum">{r.estimate_from_kwd != null ? `KD ${Number(r.estimate_from_kwd)} – ${Number(r.estimate_to_kwd)}` : '—'}</td>
              <td className="px-4 py-3 text-xs text-fg-muted">{r.notified_email_at ? '✉ ' : ''}{r.notified_whatsapp_at ? '✆' : ''}</td>
              <td className="px-4 py-3"><Badge tone={tone[r.status]}>{r.status}</Badge></td>
            </tr>
          ))}
        </Table>
      )}
    </>
  )
}
