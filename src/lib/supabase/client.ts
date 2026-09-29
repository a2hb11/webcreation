'use client'

import { createBrowserClient } from '@supabase/ssr'
import { env } from '@/lib/env'

// Browser client: publishable key only, RLS applies. Singleton under the hood.
export function createClient() {
  return createBrowserClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
}
