import 'server-only'

import { describeInquiry, type ChannelResult, type InquirySummary } from '@/lib/notify/shared'

// Owner alert through the Meta WhatsApp Cloud API.
//
// Business-initiated messages must use an approved template unless the owner
// has messaged the business number in the last 24 hours. Two modes:
//   * template (default): WHATSAPP_TEMPLATE_NAME with three body parameters
//     {{1}} name, {{2}} contact (email/phone), {{3}} short summary
//   * text: set WHATSAPP_MODE=text when the 24h window is kept open (e.g. the
//     owner's own number is the recipient and they reply to each alert).
const GRAPH_VERSION = 'v21.0'

export async function sendInquiryWhatsApp(inquiry: InquirySummary): Promise<ChannelResult> {
  const token = process.env.WHATSAPP_CLOUD_TOKEN
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const to = process.env.WHATSAPP_OWNER_NUMBER?.replace(/[^\d]/g, '')
  if (!token || !phoneNumberId || !to) return { sent: false, reason: 'not_configured' }

  const mode = process.env.WHATSAPP_MODE === 'text' ? 'text' : 'template'
  const contact = inquiry.email ?? inquiry.phone ?? '-'
  const summary = [inquiry.source, inquiry.categoryName, inquiry.tier].filter(Boolean).join(' · ')

  const payload =
    mode === 'text'
      ? {
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { preview_url: false, body: describeInquiry(inquiry).slice(0, 4000) },
        }
      : {
          messaging_product: 'whatsapp',
          to,
          type: 'template',
          template: {
            name: process.env.WHATSAPP_TEMPLATE_NAME ?? 'new_inquiry',
            language: { code: process.env.WHATSAPP_TEMPLATE_LANG ?? 'en' },
            components: [
              {
                type: 'body',
                parameters: [
                  { type: 'text', text: inquiry.name.slice(0, 60) },
                  { type: 'text', text: contact.slice(0, 60) },
                  { type: 'text', text: (summary || 'website').slice(0, 60) },
                ],
              },
            ],
          },
        }

  try {
    const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    })
    if (res.ok) return { sent: true }
    const body = await res.text().catch(() => '')
    return { sent: false, reason: `http_${res.status}: ${body.slice(0, 300)}` }
  } catch (err) {
    return { sent: false, reason: err instanceof Error ? err.message : 'unknown_error' }
  }
}
