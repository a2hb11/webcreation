'use client'

import { useActionState } from 'react'
import { idle } from '@/lib/admin/types'
import { Button, Field, FormMessage, Select, Textarea } from '@/components/admin/ui'
import { deleteInquiry, markSpam, updateInquiry } from '../actions'

const STATUSES = ['new', 'contacted', 'won', 'lost', 'spam']

export function InquiryActions({ id, status, notes }: { id: string; status: string; notes: string }) {
  const [state, action, pending] = useActionState(updateInquiry, idle)
  return (
    <aside className="flex flex-col gap-4 self-start rounded-lg border border-border p-4">
      <form action={action} className="flex flex-col gap-4">
        <input type="hidden" name="id" value={id} />
        <FormMessage state={state} />
        <Field label="Status">
          <Select name="status" defaultValue={status}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
        </Field>
        <Field label="Private notes">
          <Textarea name="admin_notes" defaultValue={notes} rows={6} maxLength={4000} />
        </Field>
        <Button type="submit" disabled={pending}>{pending ? 'Saving…' : 'Save'}</Button>
      </form>
      <div className="flex gap-2 border-t border-border pt-4">
        <form action={markSpam}>
          <input type="hidden" name="id" value={id} />
          <Button type="submit" variant="ghost">Mark as spam</Button>
        </form>
        <form action={deleteInquiry} onSubmit={(e) => { if (!confirm('Delete this inquiry permanently?')) e.preventDefault() }}>
          <input type="hidden" name="id" value={id} />
          <Button type="submit" variant="danger">Delete</Button>
        </form>
      </div>
    </aside>
  )
}
