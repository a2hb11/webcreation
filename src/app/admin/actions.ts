'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { rateLimit } from '@/lib/security/rate-limit'
import { getClientIp } from '@/lib/security/request'
import { createClient } from '@/lib/supabase/server'

export type LoginState = { error?: string }

const loginSchema = z.object({
  email: z.email().max(254),
  password: z.string().min(8).max(128),
})

const GENERIC_ERROR = 'Invalid email or password.'

export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })
  if (!parsed.success) return { error: GENERIC_ERROR }

  const ip = getClientIp(await headers())
  const perIp = await rateLimit(`admin-login:ip:${ip}`, { limit: 10, windowSeconds: 900 })
  const perAccount = await rateLimit(`admin-login:acct:${parsed.data.email.toLowerCase()}`, {
    limit: 5,
    windowSeconds: 900,
  })
  if (!perIp.ok || !perAccount.ok) {
    return { error: 'Too many attempts. Please wait 15 minutes and try again.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)
  if (error) return { error: GENERIC_ERROR }

  // Password alone is aal1; the MFA step upgrades the session to aal2.
  redirect('/admin/mfa')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut({ scope: 'global' })
  redirect('/admin/login')
}
