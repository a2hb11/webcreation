import type { Database } from '@/lib/supabase/database.types'

export type InquiryRow = Database['public']['Tables']['inquiries']['Row']

export type InquirySummary = {
  id: string
  source: InquiryRow['source']
  locale: InquiryRow['locale']
  name: string
  email: string | null
  phone: string | null
  company: string | null
  message: string
  categoryName: string | null
  tier: InquiryRow['tier']
  estimate: { from: number; to: number; currency: string } | null
  createdAt: string
}

export type ChannelResult = { sent: true } | { sent: false; reason: string }

export function describeInquiry(inquiry: InquirySummary): string {
  const lines = [
    `New ${inquiry.source} inquiry (${inquiry.locale.toUpperCase()})`,
    `Name: ${inquiry.name}`,
    inquiry.company ? `Company: ${inquiry.company}` : null,
    inquiry.email ? `Email: ${inquiry.email}` : null,
    inquiry.phone ? `Phone: ${inquiry.phone}` : null,
    inquiry.categoryName ? `Category: ${inquiry.categoryName}` : null,
    inquiry.tier ? `Tier: ${inquiry.tier}` : null,
    inquiry.estimate
      ? `Estimate: ${inquiry.estimate.from} – ${inquiry.estimate.to} ${inquiry.estimate.currency}`
      : null,
    '',
    inquiry.message,
  ]
  return lines.filter((l): l is string => l !== null).join('\n')
}
