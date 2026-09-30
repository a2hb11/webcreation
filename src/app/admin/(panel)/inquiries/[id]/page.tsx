import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { isUuid } from '@/lib/admin/crud'
import { fmtDateTime, waLink } from '@/lib/admin/format'
import { Badge, Card, PageHeader } from '@/components/admin/ui'
import { InquiryActions } from './inquiry-actions'

type Props = { params: Promise<{ id: string }> }

export default async function InquiryPage({ params }: Props) {
  await requireAdmin()
  const { id } = await params
  if (!isUuid(id)) notFound()
  const supabase = await createClient()
  const { data: row } = await supabase
    .from('inquiries')
    .select('*, category:categories(name_en), currency:currencies(code, symbol)')
    .eq('id', id)
    .maybeSingle()
  if (!row) notFound()

  const calculator = Array.isArray(row.calculator) ? (row.calculator as { slug: string; units?: number }[]) : null
  const greeting = `Hello ${row.name}, thanks for contacting Noxaur. `

  const rows: [string, React.ReactNode][] = [
    ['Received', fmtDateTime(row.created_at)],
    ['Source', `${row.source} · ${row.locale.toUpperCase()}`],
    ['Company', row.company ?? '—'],
    ['Email', row.email ? <a className="text-gold hover:underline" href={`mailto:${row.email}`} dir="ltr">{row.email}</a> : '—'],
    ['Phone', row.phone ? <span dir="ltr"><a className="text-gold hover:underline" href={`tel:${row.phone}`}>{row.phone}</a> · <a className="text-gold hover:underline" href={waLink(row.phone, greeting)} target="_blank" rel="noopener noreferrer">WhatsApp</a></span> : '—'],
    ['Category · tier', `${row.category?.name_en ?? '—'}${row.tier ? ` · ${row.tier}` : ''}`],
    ['Estimate', row.estimate_from_kwd != null ? `KD ${Number(row.estimate_from_kwd)} – ${Number(row.estimate_to_kwd)}${row.currency ? ` (viewed in ${row.currency.code})` : ''}` : '—'],
    ['Notified', `${row.notified_email_at ? `email ${fmtDateTime(row.notified_email_at)}` : 'email: not sent'} · ${row.notified_whatsapp_at ? `WhatsApp ${fmtDateTime(row.notified_whatsapp_at)}` : 'WhatsApp: not sent'}`],
  ]

  return (
    <>
      <PageHeader title={row.name} description={`Inquiry ${row.id.slice(0, 8)}`} actions={<Badge tone={row.status === 'new' ? 'gold' : 'neutral'}>{row.status}</Badge>} />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-6">
          <Card>
            <dl className="grid gap-3 text-sm sm:grid-cols-[160px_1fr]">
              {rows.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-fg-muted">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </Card>
          <Card>
            <p className="mb-2 text-sm text-fg-muted">Message</p>
            <p className="text-sm whitespace-pre-wrap" dir="auto">{row.message}</p>
          </Card>
          {calculator && calculator.length > 0 && (
            <Card>
              <p className="mb-2 text-sm text-fg-muted">Calculator selections</p>
              <ul className="list-inside list-disc text-sm">
                {calculator.map((c, i) => (
                  <li key={i}>{c.slug}{c.units ? ` × ${c.units}` : ''}</li>
                ))}
              </ul>
            </Card>
          )}
        </div>
        <InquiryActions id={row.id} status={row.status} notes={row.admin_notes} />
      </div>
    </>
  )
}
