import 'server-only'

import { sendInquiryEmail } from '@/lib/notify/email'
import { sendInquiryWhatsApp } from '@/lib/notify/whatsapp'
import { createAdminClient } from '@/lib/supabase/server'
import type { InquiryRow, InquirySummary } from '@/lib/notify/shared'

export type { ChannelResult, InquiryRow, InquirySummary } from '@/lib/notify/shared'

// Fan-out to every configured channel. The row is already stored, so a
// failing channel is logged and retried by the owner from the admin inbox
// rather than failing the visitor's submission.
export async function notifyNewInquiry(inquiry: InquirySummary): Promise<void> {
  const results = await Promise.allSettled([
    sendInquiryEmail(inquiry),
    sendInquiryWhatsApp(inquiry),
  ])

  const [email, whatsapp] = results
  const now = new Date().toISOString()
  const patch: Partial<InquiryRow> = {}
  if (email.status === 'fulfilled' && email.value.sent) patch.notified_email_at = now
  if (whatsapp.status === 'fulfilled' && whatsapp.value.sent) patch.notified_whatsapp_at = now

  for (const [channel, result] of [
    ['email', email],
    ['whatsapp', whatsapp],
  ] as const) {
    if (result.status === 'rejected') {
      console.error(`[notify] ${channel} failed for inquiry ${inquiry.id}:`, result.reason)
    } else if (!result.value.sent && result.value.reason !== 'not_configured') {
      console.error(`[notify] ${channel} not sent for inquiry ${inquiry.id}: ${result.value.reason}`)
    }
  }

  if (Object.keys(patch).length > 0) {
    const { error } = await createAdminClient().from('inquiries').update(patch).eq('id', inquiry.id)
    if (error) console.error('[notify] could not record notification timestamps:', error.message)
  }
}

