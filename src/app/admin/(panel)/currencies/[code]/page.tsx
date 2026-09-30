import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { noticeFrom } from '@/lib/admin/crud'
import { PageHeader } from '@/components/admin/ui'
import { EntityForm } from '@/components/admin/entity-form'
import { deleteCurrency, saveCurrency } from '../actions'
import { currencyRows } from '../fields'

type Props = { params: Promise<{ code: string }>; searchParams: Promise<{ saved?: string; error?: string }> }

export default async function EditCurrencyPage({ params, searchParams }: Props) {
  await requireAdmin()
  const { code } = await params
  if (!/^[A-Z]{3}$/.test(code)) notFound()
  const supabase = await createClient()
  const { data: row } = await supabase.from('currencies').select('*').eq('code', code).maybeSingle()
  if (!row) notFound()
  return (
    <>
      <PageHeader title={`${row.code} · ${row.name_en}`} />
      <EntityForm
        rows={currencyRows(true)}
        values={{ ...row, code_display: row.code }}
        id={row.code}
        idName="code"
        action={saveCurrency}
        deleteAction={deleteCurrency}
        entityLabel="currency"
        deleteNote="The default currency cannot be deleted. Currencies referenced by inquiries are kept."
        notice={noticeFrom(await searchParams)}
      />
    </>
  )
}
