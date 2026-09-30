import Link from 'next/link'
import type { Route } from 'next'
import { requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { fmtDateTime, shortId } from '@/lib/admin/format'
import { Badge, EmptyState, PageHeader, Table } from '@/components/admin/ui'

const TABLES = ['categories', 'projects', 'project_images', 'packages', 'price_factors', 'maintenance_plans', 'currencies', 'faqs', 'testimonials', 'site_settings', 'inquiries', 'admin_users']

export default async function AuditLogPage({ searchParams }: { searchParams: Promise<{ table?: string }> }) {
  await requireAdmin()
  const { table } = await searchParams
  const filter = table && TABLES.includes(table) ? table : null
  const supabase = await createClient()
  let query = supabase.from('audit_log').select('*').order('created_at', { ascending: false }).limit(100)
  if (filter) query = query.eq('table_name', filter)
  const { data, error } = await query
  if (error) throw error
  const tone = { INSERT: 'success', UPDATE: 'gold', DELETE: 'error' } as const

  return (
    <>
      <PageHeader title="Audit log" description="Every change made through the admin, newest first (latest 100)." />
      <nav className="mb-4 flex flex-wrap gap-2 text-sm">
        <Link href="/admin/audit-log" className={`rounded-full border px-3 py-1 ${!filter ? 'border-gold text-gold' : 'border-border text-fg-muted'}`}>all</Link>
        {TABLES.map((t) => (
          <Link key={t} href={`/admin/audit-log?table=${t}` as Route} className={`rounded-full border px-3 py-1 ${filter === t ? 'border-gold text-gold' : 'border-border text-fg-muted hover:text-fg'}`}>{t}</Link>
        ))}
      </nav>
      {data.length === 0 ? (
        <EmptyState title="No entries." />
      ) : (
        <Table head={['When', 'Actor', 'Action', 'Table', 'Row', 'Details']}>
          {data.map((r) => (
            <tr key={r.id} className="align-top hover:bg-surface-hover">
              <td className="px-4 py-3 whitespace-nowrap text-fg-muted tnum">{fmtDateTime(r.created_at)}</td>
              <td className="px-4 py-3 font-mono text-xs text-fg-muted">{shortId(r.actor)}</td>
              <td className="px-4 py-3"><Badge tone={tone[r.action as keyof typeof tone] ?? 'neutral'}>{r.action}</Badge></td>
              <td className="px-4 py-3 font-mono text-xs">{r.table_name}</td>
              <td className="px-4 py-3 font-mono text-xs text-fg-muted">{r.row_id?.slice(0, 8) ?? '—'}</td>
              <td className="px-4 py-3">
                <details>
                  <summary className="cursor-pointer text-xs text-gold">show</summary>
                  <pre className="mt-2 max-h-64 max-w-md overflow-auto rounded bg-surface p-2 text-[11px] leading-snug">{JSON.stringify({ old: r.old_row, new: r.new_row }, null, 2)}</pre>
                </details>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </>
  )
}
