import { requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/admin/ui'
import { EntityForm } from '@/components/admin/entity-form'
import type { FieldRow } from '@/lib/admin/fields'
import { bilingual } from '@/lib/admin/fields'
import { saveSettings } from './actions'

const rows: FieldRow[] = [
  bilingual('studio_name', 'Studio name', 'text', { max: 60 }),
  [
    { kind: 'text', name: 'whatsapp_number', label: 'WhatsApp number', hint: 'International format, e.g. +96560643311', required: true, dir: 'ltr' },
    { kind: 'text', name: 'instagram_handle', label: 'Instagram handle', hint: 'Without @. Leave empty to hide.', dir: 'ltr' },
    { kind: 'email', name: 'contact_email', label: 'Public contact email', hint: 'Leave empty to hide.', dir: 'ltr' },
  ],
  bilingual('hours', 'Working hours', 'text', { max: 120 }),
  bilingual('location', 'Location', 'text', { max: 120 }),
  bilingual('payment_terms', 'Payment terms', 'text', { max: 160 }),
  [{ kind: 'email', name: 'notify_email', label: 'Where inquiry emails are sent (private)', hint: 'Not shown on the site.', dir: 'ltr' }],
]

const pair = (v: unknown) => (v && typeof v === 'object' ? (v as { en?: string; ar?: string }) : { en: '', ar: '' })

export default async function SettingsPage() {
  await requireAdmin()
  const supabase = await createClient()
  const { data } = await supabase.from('site_settings').select('key, value')
  const map = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]))
  const values: Record<string, unknown> = {
    whatsapp_number: map.whatsapp_number ?? '',
    instagram_handle: map.instagram_handle ?? '',
    contact_email: map.contact_email ?? '',
    notify_email: map.notify_email ?? '',
  }
  for (const k of ['studio_name', 'hours', 'location', 'payment_terms']) {
    const v = pair(map[k])
    values[`${k}_en`] = v.en ?? ''
    values[`${k}_ar`] = v.ar ?? ''
  }
  return (
    <>
      <PageHeader title="Settings" description="Contact details shown in the footer and on the contact page. WhatsApp, Instagram and email appear only when filled in." />
      <EntityForm rows={rows} values={values} action={saveSettings} entityLabel="settings" submitLabel="Save settings" />
    </>
  )
}
