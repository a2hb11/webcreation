'use server'

import { updateTag } from 'next/cache'
import { z } from 'zod'
import { runAdminAction } from '@/lib/admin/action'
import { text } from '@/lib/admin/form'
import type { ActionState } from '@/lib/admin/types'
import { cacheTags } from '@/lib/data/public'

const pair = (max: number) => z.object({ en: z.string().trim().max(max), ar: z.string().trim().max(max) })
const emptyOr = <T extends z.ZodType>(inner: T) => z.union([z.literal(''), inner])

const schema = z.object({
  studio_name: pair(60),
  whatsapp_number: z.string().regex(/^\+[1-9]\d{6,14}$/, 'international format, e.g. +96560643311'),
  instagram_handle: z.string().trim().regex(/^[A-Za-z0-9._]{0,30}$/, 'letters, numbers, dots and underscores only'),
  contact_email: emptyOr(z.email().max(254)),
  hours: pair(120),
  location: pair(120),
  payment_terms: pair(160),
  notify_email: emptyOr(z.email().max(254)),
})

// key -> public?  (everything else in the schema is public)
const PRIVATE_KEYS = new Set(['notify_email'])

export async function saveSettings(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const p = (k: string) => ({ en: text(fd, `${k}_en`), ar: text(fd, `${k}_ar`) })
  return runAdminAction(
    schema,
    {
      studio_name: p('studio_name'),
      whatsapp_number: text(fd, 'whatsapp_number').replace(/[\s-]/g, ''),
      instagram_handle: text(fd, 'instagram_handle').replace(/^@/, ''),
      contact_email: text(fd, 'contact_email'),
      hours: p('hours'),
      location: p('location'),
      payment_terms: p('payment_terms'),
      notify_email: text(fd, 'notify_email'),
    },
    async (data, { supabase }) => {
      const rows = Object.entries(data).map(([key, value]) => ({ key, value, is_public: !PRIVATE_KEYS.has(key) }))
      const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' })
      if (error) return { status: 'error', message: error.message }
      updateTag(cacheTags.settings)
      return { status: 'success', message: 'Settings saved.' }
    },
  )
}
