import 'server-only'

import type { Route } from 'next'
import { updateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { dbErrorMessage, runAdminAction } from '@/lib/admin/action'
import type { ActionState } from '@/lib/admin/types'
import { text } from '@/lib/admin/form'
import type { Database } from '@/lib/supabase/database.types'

type TableName = keyof Database['public']['Tables']

type Opts<S extends z.ZodType> = {
  table: TableName
  schema: S
  /** Cache tags to expire after a write. */
  tags: string[]
  /** Admin route prefix, e.g. '/admin/faqs'. */
  route: string
  idColumn?: string
  /** Optional extra step before the write (e.g. clearing another row's flag). */
  before?: (data: z.infer<S>, supabase: SupabaseLike) => Promise<string | null>
  /** Maps a duplicate-key error to a friendlier message. */
  uniqueMessage?: string
  /** Fields that are validation-only and must not be written. */
  omit?: string[]
  /** For tables whose id is user-supplied (e.g. currency code): decides insert vs update. */
  isUpdate?: (data: z.infer<S>) => boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseLike = any

// Generic insert-or-update for the simple entities. The schema must contain an
// optional `id` (or the given idColumn) and only the columns that may be set.
export function makeSave<S extends z.ZodType>(opts: Opts<S>) {
  const idColumn = opts.idColumn ?? 'id'
  return async (input: unknown): Promise<ActionState> =>
    runAdminAction(opts.schema, input, async (data, { supabase }) => {
      const record = data as Record<string, unknown>
      const key = record[idColumn] as string | undefined
      const updating = opts.isUpdate ? opts.isUpdate(data) : Boolean(key)
      const id = updating ? key : undefined
      const values = { ...record }
      if (idColumn === 'id') delete values.id
      for (const k of opts.omit ?? []) delete values[k]
      if (opts.before) {
        const problem = await opts.before(data, supabase)
        if (problem) return { status: 'error', message: problem }
      }
      const table = supabase.from(opts.table) as SupabaseLike
      const query = id ? table.update(values).eq(idColumn, id) : table.insert(values)
      const { data: row, error } = await query.select(idColumn).single()
      if (error) {
        const message = error.code === '23505' && opts.uniqueMessage ? opts.uniqueMessage : dbErrorMessage(error)
        return { status: 'error', message }
      }
      opts.tags.forEach((t) => updateTag(t))
      const newId = String((row as Record<string, unknown>)[idColumn])
      if (!id) redirect(`${opts.route}/${encodeURIComponent(newId)}?saved=1` as Route)
      return { status: 'success', message: 'Saved.', id: newId }
    })
}

export function makeDelete(opts: {
  table: TableName
  tags: string[]
  route: string
  idColumn?: string
  idSchema?: z.ZodType
  guard?: (id: string, supabase: SupabaseLike) => Promise<string | null>
}) {
  const idColumn = opts.idColumn ?? 'id'
  const schema = z.object({ id: opts.idSchema ?? z.uuid() })
  return async (formData: FormData): Promise<void> => {
    const id = text(formData, idColumn)
    const result = await runAdminAction(schema, { id }, async (data, { supabase }) => {
      const id = String((data as { id: unknown }).id)
      if (opts.guard) {
        const problem = await opts.guard(id, supabase)
        if (problem) return { status: 'error', message: problem }
      }
      const { error } = await (supabase.from(opts.table) as SupabaseLike).delete().eq(idColumn, id)
      if (error) return { status: 'error', message: dbErrorMessage(error) }
      opts.tags.forEach((t) => updateTag(t))
      return { status: 'success' }
    })
    if (result.status === 'error') {
      redirect(`${opts.route}/${encodeURIComponent(id)}?error=${encodeURIComponent(result.message)}` as Route)
    }
    redirect(opts.route as Route)
  }
}

// Shared page helpers -----------------------------------------------------

export function noticeFrom(search: { saved?: string; error?: string }): ActionState | undefined {
  if (search.error) return { status: 'error', message: search.error }
  if (search.saved) return { status: 'success', message: 'Created.' }
  return undefined
}

export const isUuid = (s: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s)
