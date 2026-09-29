import 'server-only'

import { createServerClient } from '@supabase/ssr'
import { createClient as createBaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { env, secrets } from '@/lib/env'

// Per-request client bound to the visitor's session cookies. RLS applies.
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Called from a Server Component: the proxy refreshes sessions instead.
        }
      },
    },
  })
}

// Service-role client. Bypasses RLS: use it only in server code that has
// already validated its input (inquiry inserts, admin uploads). Never cache
// it in a module-level variable and never expose it to the browser.
export function createAdminClient() {
  return createBaseClient(env.NEXT_PUBLIC_SUPABASE_URL, secrets.SUPABASE_SECRET_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
}
