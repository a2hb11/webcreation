import createIntlMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from '@/i18n/routing'
import { buildCsp, generateNonce, staticSecurityHeaders } from '@/lib/security/csp'
import { applyRefresh, hasSupabaseSession, refreshSession } from '@/lib/supabase/proxy'

const handleI18n = createIntlMiddleware(routing)

// Admin lives outside the [locale] tree (English only, never indexed).
const ADMIN_PREFIX = '/admin'
const ADMIN_LOGIN = '/admin/login'
const ADMIN_MFA = '/admin/mfa'

export async function proxy(request: NextRequest) {
  const nonce = generateNonce()
  const csp = buildCsp({
    nonce,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    isDev: process.env.NODE_ENV === 'development',
  })

  // Forward the nonce and policy to the render so Next.js can tag its own
  // scripts; both are re-read from the request headers, not the response.
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', csp)
  const req = new NextRequest(request, { headers: requestHeaders })

  const { pathname } = req.nextUrl
  const isAdmin = pathname === ADMIN_PREFIX || pathname.startsWith(`${ADMIN_PREFIX}/`)

  let response: NextResponse
  if (isAdmin) {
    response = await guardAdmin(req)
  } else {
    // Refresh first so the forwarded request carries fresh cookies, then let
    // next-intl route the locale (it clones the request headers).
    const refresh = hasSupabaseSession(req) ? await refreshSession(req) : null
    response = await handleI18n(req)
    if (refresh) applyRefresh(response, refresh)
  }

  response.headers.set('Content-Security-Policy', csp)
  for (const [key, value] of Object.entries(staticSecurityHeaders)) {
    response.headers.set(key, value)
  }
  return response
}

// Coarse gate for the admin area. Server Components and Server Actions in
// /admin re-verify the session and MFA level themselves; this only keeps
// unauthenticated traffic away from the UI and never grants anything.
async function guardAdmin(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl
  const refresh = hasSupabaseSession(req)
    ? await refreshSession(req)
    : { claims: null, cookiesToSet: [], headers: {} }
  const claims = refresh.claims

  const respond = (target?: string) => {
    const res = target
      ? NextResponse.redirect(new URL(target, req.url))
      : NextResponse.next({ request: { headers: req.headers } })
    applyRefresh(res, refresh)
    res.headers.set('X-Robots-Tag', 'noindex, nofollow')
    res.headers.set('Cache-Control', 'no-store')
    return res
  }

  const onLogin = pathname === ADMIN_LOGIN
  const onMfa = pathname === ADMIN_MFA

  if (!claims) return onLogin ? respond() : respond(ADMIN_LOGIN)
  if (claims.aal !== 'aal2') return onMfa ? respond() : respond(ADMIN_MFA)
  if (onLogin || onMfa) return respond(ADMIN_PREFIX)
  return respond()
}

export const config = {
  matcher: [
    // Everything except Next internals, Vercel internals, API routes and
    // static files (anything with an extension).
    {
      source: '/((?!api|_next|_vercel|.*\\..*).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
