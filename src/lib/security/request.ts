import 'server-only'

// Vercel sets x-forwarded-for with the client first; x-real-ip is a fallback.
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  return headers.get('x-real-ip')?.trim() || '0.0.0.0'
}

// Stored instead of the raw IP: enough to spot abuse, not enough to identify.
export async function hashIp(ip: string): Promise<string> {
  const salt = process.env.IP_HASH_SALT ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'studio'
  const data = new TextEncoder().encode(`${salt}:${ip}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
}
