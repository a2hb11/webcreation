import 'server-only'

export type TurnstileResult = { ok: true } | { ok: false; reason: string }

// Server-side verification of a Cloudflare Turnstile token. Fails closed in
// production when the secret is missing; in development it is skipped so the
// forms can be exercised without keys.
export async function verifyTurnstile(token: unknown, ip: string): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    if (process.env.NODE_ENV !== 'production') return { ok: true }
    return { ok: false, reason: 'captcha_not_configured' }
  }
  if (typeof token !== 'string' || token.length === 0 || token.length > 2048) {
    return { ok: false, reason: 'captcha_missing' }
  }

  const body = new URLSearchParams({ secret, response: token, remoteip: ip })
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(5000),
    })
    const json = (await res.json()) as { success?: boolean; 'error-codes'?: string[] }
    return json.success ? { ok: true } : { ok: false, reason: json['error-codes']?.join(',') || 'captcha_failed' }
  } catch {
    return { ok: false, reason: 'captcha_unreachable' }
  }
}
