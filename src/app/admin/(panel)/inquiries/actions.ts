'use server'

import type { Route } from 'next'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { runAdminAction } from '@/lib/admin/action'
import { text, zUuid } from '@/lib/admin/form'
import type { ActionState } from '@/lib/admin/types'

const STATUSES = ['new', 'contacted', 'won', 'lost', 'spam'] as const

const schema = z.object({
  id: zUuid,
  status: z.enum(STATUSES),
  admin_notes: z.string().trim().max(4000),
})

export async function updateInquiry(_prev: ActionState, fd: FormData): Promise<ActionState> {
  return runAdminAction(
    schema,
    { id: text(fd, 'id'), status: text(fd, 'status'), admin_notes: text(fd, 'admin_notes') },
    async ({ id, ...values }, { supabase }) => {
      const { error } = await supabase.from('inquiries').update(values).eq('id', id)
      if (error) return { status: 'error', message: error.message }
      return { status: 'success', message: 'Saved.' }
    },
  )
}

export async function markSpam(fd: FormData): Promise<void> {
  await runAdminAction(z.object({ id: zUuid }), { id: text(fd, 'id') }, async ({ id }, { supabase }) => {
    await supabase.from('inquiries').update({ status: 'spam' }).eq('id', id)
    return { status: 'success' }
  })
  redirect('/admin/inquiries')
}

export async function deleteInquiry(fd: FormData): Promise<void> {
  await runAdminAction(z.object({ id: zUuid }), { id: text(fd, 'id') }, async ({ id }, { supabase }) => {
    await supabase.from('inquiries').delete().eq('id', id)
    return { status: 'success' }
  })
  redirect('/admin/inquiries' as Route)
}
