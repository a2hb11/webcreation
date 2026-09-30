'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Props = {
  mode: 'enroll' | 'challenge'
  factorId: string | null
  staleFactorIds: string[]
}

const inputClass =
  'rounded-md border border-border bg-surface px-3 py-2 text-center font-mono text-lg tracking-[0.4em] text-fg outline-none focus:border-gold'

export function MfaGate({ mode, factorId: initialFactorId, staleFactorIds }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [factorId, setFactorId] = useState(initialFactorId)
  const [qr, setQr] = useState<string | null>(null)
  const [secret, setSecret] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    if (mode !== 'enroll') return
    let cancelled = false
    ;(async () => {
      // Drop leftovers from abandoned enrolments so we start clean.
      for (const id of staleFactorIds) await supabase.auth.mfa.unenroll({ factorId: id })
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Authenticator app',
      })
      if (cancelled) return
      if (error || !data) {
        setError(error?.message ?? 'Could not start enrolment.')
        return
      }
      setFactorId(data.id)
      setQr(data.totp.qr_code)
      setSecret(data.totp.secret)
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!factorId) return
    setError(null)
    startTransition(async () => {
      const challenge = await supabase.auth.mfa.challenge({ factorId })
      if (challenge.error || !challenge.data) {
        setError(challenge.error?.message ?? 'Challenge failed.')
        return
      }
      const verify = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.data.id,
        code: code.trim(),
      })
      if (verify.error) {
        setError('That code was not accepted. Try the next one.')
        setCode('')
        return
      }
      // The session is now aal2; the proxy and requireAdmin() re-check it.
      router.replace('/admin')
      router.refresh()
    })
  }

  return (
    <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
      {mode === 'enroll' && (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-surface p-4">
          <p className="text-sm text-fg-muted">
            Scan this with Google Authenticator, 1Password, Authy or any TOTP app, then enter the
            6-digit code.
          </p>
          {qr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qr} alt="QR code for the authenticator app" width={180} height={180} />
          ) : (
            <div className="h-[180px] w-[180px] animate-pulse rounded bg-bg-elevated" />
          )}
          {secret && (
            <p className="break-all text-center font-mono text-xs text-fg-subtle">{secret}</p>
          )}
        </div>
      )}
      <label className="flex flex-col gap-1 text-sm">
        Code from your authenticator app
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          inputMode="numeric"
          pattern="[0-9]{6}"
          autoComplete="one-time-code"
          required
          className={inputClass}
        />
      </label>
      {error && (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending || !factorId || code.length !== 6}
        className="rounded-md bg-gold px-4 py-2 font-medium text-bg transition hover:bg-gold-hover disabled:opacity-60"
      >
        {pending ? 'Verifying…' : mode === 'enroll' ? 'Enable and continue' : 'Verify'}
      </button>
    </form>
  )
}
