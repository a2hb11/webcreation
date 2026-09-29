// Content Security Policy and companion headers.
//
// Nonce-based: every HTML response gets a fresh nonce, Next.js attaches it to
// its own scripts/styles automatically (it reads the CSP request header), so
// no 'unsafe-inline' is needed in production.

export function generateNonce(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return btoa(String.fromCharCode(...bytes))
}

type CspOptions = {
  nonce: string
  supabaseUrl: string
  isDev: boolean
}

export function buildCsp({ nonce, supabaseUrl, isDev }: CspOptions): string {
  const supabaseOrigin = new URL(supabaseUrl).origin
  const supabaseWs = supabaseOrigin.replace(/^http/, 'ws')

  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      `'nonce-${nonce}'`,
      "'strict-dynamic'",
      'https://challenges.cloudflare.com',
      ...(isDev ? ["'unsafe-eval'"] : []),
    ],
    // Styles: in production only nonce'd <style> tags and self-hosted CSS.
    // Motion/Framer set inline `style=""` attributes, which CSP does not
    // govern (only <style> elements and javascript: URLs are), so this stays
    // strict without breaking animations.
    'style-src': ["'self'", isDev ? "'unsafe-inline'" : `'nonce-${nonce}'`],
    'img-src': ["'self'", 'blob:', 'data:', supabaseOrigin],
    'font-src': ["'self'"],
    'connect-src': ["'self'", supabaseOrigin, supabaseWs, 'https://challenges.cloudflare.com'],
    'frame-src': ['https://challenges.cloudflare.com'],
    'worker-src': ["'self'", 'blob:'],
    'manifest-src': ["'self'"],
    'media-src': ["'self'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    ...(isDev ? {} : { 'upgrade-insecure-requests': [] }),
  }

  return Object.entries(directives)
    .map(([key, values]) => (values.length ? `${key} ${values.join(' ')}` : key))
    .join('; ')
}

// Headers that do not depend on the request.
export const staticSecurityHeaders: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy':
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=(), interest-cohort=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'X-DNS-Prefetch-Control': 'off',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
}
