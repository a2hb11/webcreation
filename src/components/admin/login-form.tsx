'use client'

import { useActionState } from 'react'
import { signIn, type LoginState } from '@/app/admin/actions'

const initial: LoginState = {}

export function LoginForm({ notice }: { notice?: string }) {
  const [state, action, pending] = useActionState(signIn, initial)

  return (
    <form action={action} className="mt-8 flex flex-col gap-4" autoComplete="on">
      {notice && (
        <p role="alert" className="rounded-md border border-error/40 bg-error/10 px-3 py-2 text-sm">
          {notice}
        </p>
      )}
      <label className="flex flex-col gap-1 text-sm">
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          className="rounded-md border border-border bg-surface px-3 py-2 text-fg outline-none focus:border-gold"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Password
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="current-password"
          className="rounded-md border border-border bg-surface px-3 py-2 text-fg outline-none focus:border-gold"
        />
      </label>
      {state.error && (
        <p role="alert" className="text-sm text-error">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-md bg-gold px-4 py-2 font-medium text-bg transition hover:bg-gold-hover disabled:opacity-60"
      >
        {pending ? 'Signing in…' : 'Continue'}
      </button>
    </form>
  )
}
