import Link from 'next/link'
import type { Route } from 'next'
import type { ComponentProps, ReactNode } from 'react'

// Small, unopinionated primitives for the admin panel. Public-site styling
// lives elsewhere; this only needs to be clear and consistent.

const control =
  'w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg outline-none transition focus:border-gold disabled:opacity-60'

export function Field({
  label,
  hint,
  error,
  children,
  className = '',
}: {
  label: string
  hint?: string
  error?: string[]
  children: ReactNode
  className?: string
}) {
  return (
    <label className={`flex flex-col gap-1 text-sm ${className}`}>
      <span className="font-medium">{label}</span>
      {children}
      {hint && !error && <span className="text-xs text-fg-subtle">{hint}</span>}
      {error && (
        <span role="alert" className="text-xs text-error">
          {error.join(' ')}
        </span>
      )}
    </label>
  )
}

export function Input(props: ComponentProps<'input'>) {
  return <input {...props} className={`${control} ${props.className ?? ''}`} />
}

export function Textarea(props: ComponentProps<'textarea'>) {
  return <textarea rows={4} {...props} className={`${control} ${props.className ?? ''}`} />
}

export function Select(props: ComponentProps<'select'>) {
  return <select {...props} className={`${control} ${props.className ?? ''}`} />
}

export function Checkbox({ label, ...props }: ComponentProps<'input'> & { label: string }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" {...props} className="size-4 accent-gold" />
      {label}
    </label>
  )
}

type ButtonProps = ComponentProps<'button'> & { variant?: 'primary' | 'ghost' | 'danger' }

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const styles = {
    primary: 'bg-gold text-bg hover:bg-gold-hover',
    ghost: 'border border-border text-fg hover:bg-surface-hover',
    danger: 'border border-error/40 text-error hover:bg-error/10',
  }[variant]
  return (
    <button
      {...props}
      className={`rounded-md px-4 py-2 text-sm font-medium transition disabled:opacity-60 ${styles} ${className}`}
    />
  )
}

export function LinkButton({
  href,
  children,
  variant = 'ghost',
}: {
  href: Route
  children: ReactNode
  variant?: 'primary' | 'ghost'
}) {
  const styles =
    variant === 'primary'
      ? 'bg-gold text-bg hover:bg-gold-hover'
      : 'border border-border text-fg hover:bg-surface-hover'
  return (
    <Link href={href} className={`rounded-md px-4 py-2 text-sm font-medium transition ${styles}`}>
      {children}
    </Link>
  )
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-fg-muted">{description}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </header>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-border bg-bg-elevated p-5 ${className}`}>{children}</div>
  )
}

export function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-surface text-left text-xs tracking-wide text-fg-muted uppercase">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-4 py-3 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">{children}</tbody>
      </table>
    </div>
  )
}

export function Badge({ tone = 'neutral', children }: { tone?: 'neutral' | 'gold' | 'success' | 'error'; children: ReactNode }) {
  const styles = {
    neutral: 'bg-surface text-fg-muted',
    gold: 'bg-gold-soft text-gold-text',
    success: 'bg-success/15 text-success',
    error: 'bg-error/15 text-error',
  }[tone]
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles}`}>{children}</span>
}

export function EmptyState({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-border p-10 text-center">
      <p className="text-fg-muted">{title}</p>
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  )
}

export function FormMessage({ state }: { state: { status: string; message?: string } }) {
  if (state.status === 'error' && state.message) {
    return (
      <p role="alert" className="rounded-md border border-error/40 bg-error/10 px-3 py-2 text-sm">
        {state.message}
      </p>
    )
  }
  if (state.status === 'success' && state.message) {
    return (
      <p role="status" className="rounded-md border border-success/40 bg-success/10 px-3 py-2 text-sm">
        {state.message}
      </p>
    )
  }
  return null
}
