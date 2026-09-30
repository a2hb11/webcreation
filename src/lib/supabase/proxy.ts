import { createServerClient, type CookieOptions } from '@supabase/ssr'
import type { NextRequest, NextResponse } from 'next/server'

type CookieToSet = { name: string; value: string; options: CookieOptions }

export type SessionClaims = {
  sub: string
  email?: string
  aal?: 'aal1' | 'aal2'
  role?: string
} | null

export type RefreshResult = {
  claims: SessionClaims
  cookiesToSet: CookieToSet[]
  headers: Record<string, string>
}

// True when the browser sent any Supabase auth cookie. Anonymous visitors
// never do, so they skip the refresh path entirely.
export function hasSupabaseSession(request: NextRequest): boolean {
  return request.cookies.getAll().some((c) => c.name.startsWith('sb-'))
}

// Refreshes an expired session (if any) and returns the verified claims plus
// the cookies/headers that must be copied onto the outgoing response.
// Mutates `request.cookies` so that the render sees the refreshed token.
export async function refreshSession(request: NextRequest): Promise<RefreshResult> {
  const result: RefreshResult = { claims: null, cookiesToSet: [], headers: {} }

  // Always a fresh client per request (never module-level; Fluid compute
  // reuses the process across requests).
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          result.cookiesToSet = cookiesToSet
          result.headers = headers
        },
      },
    },
  )

  // Do not run code between createServerClient and getClaims(): the call is
  // what performs the refresh and keeps the browser/server cookies in sync.
  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims
  if (claims && typeof claims.sub === 'string') {
    result.claims = {
      sub: claims.sub,
      email: typeof claims.email === 'string' ? claims.email : undefined,
      aal: claims.aal === 'aal2' ? 'aal2' : 'aal1',
      role: typeof claims.role === 'string' ? claims.role : undefined,
    }
  }
  return result
}

export function applyRefresh(response: NextResponse, refresh: RefreshResult) {
  refresh.cookiesToSet.forEach(({ name, value, options }) =>
    response.cookies.set(name, value, options),
  )
  Object.entries(refresh.headers).forEach(([key, value]) => response.headers.set(key, value))
  return response
}
