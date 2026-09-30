import 'server-only'

import { Resend } from 'resend'
import { describeInquiry, type ChannelResult, type InquirySummary } from '@/lib/notify/shared'

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

export async function sendInquiryEmail(inquiry: InquirySummary): Promise<ChannelResult> {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.NOTIFY_EMAIL_TO
  const from = process.env.NOTIFY_EMAIL_FROM
  if (!apiKey || !to || !from) return { sent: false, reason: 'not_configured' }

  const text = describeInquiry(inquiry)
  const adminUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/admin/inquiries/${inquiry.id}`

  const { error } = await new Resend(apiKey).emails.send({
    from,
    to: to.split(',').map((s) => s.trim()),
    replyTo: inquiry.email ?? undefined,
    subject: `New inquiry from ${inquiry.name}${inquiry.company ? ` (${inquiry.company})` : ''}`,
    text: `${text}\n\nOpen in admin: ${adminUrl}`,
    html: `<pre style="font: 14px/1.5 system-ui, sans-serif; white-space: pre-wrap">${escapeHtml(text)}</pre><p><a href="${escapeHtml(adminUrl)}">Open in admin</a></p>`,
  })

  return error ? { sent: false, reason: error.message } : { sent: true }
}
