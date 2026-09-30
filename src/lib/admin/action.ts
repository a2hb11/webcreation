import 'server-only'

import { unstable_rethrow } from 'next/navigation'
import type { z } from 'zod'
import { requireAdmin, type AdminSession } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'

import type { ActionState } from '@/lib/admin/types'

export type { ActionState } from '@/lib/admin/types'
export { idle } from '@/lib/admin/types'

type Ctx = {
  supabase: Awaited<ReturnType<typeof createClient>>
  session: AdminSession
}

// Every admin mutation goes through here: the session is re-verified inside
// the action (Server Actions are public POST endpoints), input is parsed with
// the entity's schema, and the session-bound client keeps RLS in force so a
// bug in the handler can never exceed what the database allows.
export async function runAdminAction<S extends z.ZodType>(
  schema: S,
  input: unknown,
  handler: (data: z.infer<S>, ctx: Ctx) => Promise<ActionState>,
): Promise<ActionState> {
  const session = await requireAdmin()
  const parsed = schema.safeParse(input)
  if (!parsed.success) {
    const fields: Record<string, string[] | undefined> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path.map(String).join('.') || '_'
      ;(fields[key] ??= []).push(issue.message)
    }
    return { status: 'error', message: 'Please fix the highlighted fields.', fields }
  }
  try {
    const supabase = await createClient()
    return await handler(parsed.data, { supabase, session })
  } catch (error) {
    unstable_rethrow(error)
    console.error('[admin action]', error)
    return { status: 'error', message: 'Something went wrong. Nothing was saved.' }
  }
}

// Postgres error codes worth translating for the owner.
export function dbErrorMessage(error: { code?: string; message: string }): string {
  switch (error.code) {
    case '23505':
      return 'That value must be unique (slug, code or name already exists).'
    case '23503':
      return 'This item is still referenced by other content and cannot be deleted.'
    case '23514':
      return 'A value is outside the allowed range.'
    case '42501':
      return 'Not allowed. Sign in again with two-factor authentication.'
    default:
      return error.message
  }
}
