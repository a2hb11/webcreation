import 'server-only'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type AdminSession = { userId: string; email: string }

export type SessionCheck =
  | { status: 'anonymous' }
  | { status: 'needs_mfa'; userId: string; email: string }
  | { status: 'not_admin'; userId: string; email: string }
  | { status: 'admin'; session: AdminSession }

// Verifies the signed JWT, requires MFA (aal2) and membership in the
// admin_users allowlist (checked in Postgres by is_admin(), which the RLS
// policies use as well, so the UI and the data layer can never disagree).
export async function checkAdminSession(): Promise<SessionCheck> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims
  if (!claims || typeof claims.sub !== 'string') return { status: 'anonymous' }

  const email = typeof claims.email === 'string' ? claims.email : ''
  if (claims.aal !== 'aal2') return { status: 'needs_mfa', userId: claims.sub, email }

  const { data: isAdmin } = await supabase.rpc('is_admin')
  if (!isAdmin) return { status: 'not_admin', userId: claims.sub, email }

  return { status: 'admin', session: { userId: claims.sub, email } }
}

// For Server Components and Server Actions under /admin. Redirects instead of
// throwing so a stale session lands on the right screen.
export async function requireAdmin(): Promise<AdminSession> {
  const check = await checkAdminSession()
  switch (check.status) {
    case 'admin':
      return check.session
    case 'needs_mfa':
      redirect('/admin/mfa')
    case 'not_admin':
      redirect('/admin/login?error=not_admin')
    default:
      redirect('/admin/login')
  }
}
