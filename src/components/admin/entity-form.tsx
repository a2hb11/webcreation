'use client'

import { useActionState } from 'react'
import { idle, type ActionState } from '@/lib/admin/types'
import type { FieldDef, FieldRow } from '@/lib/admin/fields'
import { Button, Checkbox, Field, FormMessage, Input, Select, Textarea } from '@/components/admin/ui'

type Props = {
  rows: FieldRow[]
  values?: Record<string, unknown>
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>
  deleteAction?: (formData: FormData) => Promise<void>
  id?: string
  idName?: string
  entityLabel: string
  submitLabel?: string
  deleteNote?: string
  notice?: ActionState
}

const str = (v: unknown) => (v === null || v === undefined ? '' : String(v))

function renderField(f: FieldDef, values: Record<string, unknown>, err?: Record<string, string[] | undefined>) {
  const value = values[f.name]
  const error = err?.[f.name]
  switch (f.kind) {
    case 'checkbox':
      return <Checkbox key={f.name} name={f.name} label={f.label} defaultChecked={Boolean(value)} />
    case 'textarea':
      return (
        <Field key={f.name} label={f.label} hint={f.hint} error={error}>
          <Textarea name={f.name} defaultValue={str(value)} rows={f.rows ?? 3} maxLength={f.max} dir={f.dir} />
        </Field>
      )
    case 'lines':
      return (
        <Field key={f.name} label={f.label} hint={f.hint} error={error}>
          <Textarea name={f.name} defaultValue={str(value)} rows={f.rows ?? 6} className="font-mono text-xs" dir="auto" />
        </Field>
      )
    case 'number':
      return (
        <Field key={f.name} label={f.label} hint={f.hint} error={error}>
          <Input name={f.name} type="number" defaultValue={str(value)} min={f.min} max={f.max} step={f.step ?? 'any'} required={f.required} />
        </Field>
      )
    case 'select':
      return (
        <Field key={f.name} label={f.label} hint={f.hint} error={error}>
          <Select name={f.name} defaultValue={str(value)}>
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </Field>
      )
    default:
      return (
        <Field key={f.name} label={f.label} hint={f.hint} error={error}>
          <Input
            name={f.name}
            type={f.kind === 'email' ? 'email' : f.kind === 'url' ? 'url' : 'text'}
            defaultValue={str(value)}
            required={f.required}
            maxLength={f.max}
            dir={f.dir}
            readOnly={f.readOnly}
            pattern={f.kind === 'slug' ? '[a-z0-9]+(-[a-z0-9]+)*' : undefined}
            className={f.readOnly ? 'opacity-60' : ''}
          />
        </Field>
      )
  }
}

export function EntityForm({ rows, values = {}, action, deleteAction, id, idName = 'id', entityLabel, submitLabel, deleteNote, notice }: Props) {
  const [state, formAction, pending] = useActionState(action, notice ?? idle)
  const err = state.status === 'error' ? state.fields : undefined
  const cols = (n: number) => (n === 3 ? 'sm:grid-cols-3' : n === 2 ? 'sm:grid-cols-2' : '')

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
      <form action={formAction} className="flex flex-col gap-5">
        {id && <input type="hidden" name={idName} value={id} />}
        <FormMessage state={state} />
        {rows.map((row, i) => (
          <div key={i} className={`grid gap-5 ${cols(row.length)}`}>
            {row.map((f) => renderField(f, values, err))}
          </div>
        ))}
        <div>
          <Button type="submit" disabled={pending}>
            {pending ? 'Saving…' : submitLabel ?? (id ? 'Save changes' : `Create ${entityLabel}`)}
          </Button>
        </div>
      </form>
      {id && deleteAction && (
        <aside className="flex flex-col gap-3 self-start rounded-lg border border-border p-4 text-sm">
          <p className="font-medium">Danger zone</p>
          {deleteNote && <p className="text-fg-muted">{deleteNote}</p>}
          <form
            action={deleteAction}
            onSubmit={(e) => {
              if (!confirm(`Delete this ${entityLabel}?`)) e.preventDefault()
            }}
          >
            <input type="hidden" name={idName} value={id} />
            <Button type="submit" variant="danger">
              Delete {entityLabel}
            </Button>
          </form>
        </aside>
      )}
    </div>
  )
}
