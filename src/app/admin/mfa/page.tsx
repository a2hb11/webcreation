import { redirect } from 'next/navigation'
import { checkAdminSession } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { MfaGate } from '@/components/admin/mfa-gate'
import { signOut } from '@/app/admin/actions'

export default async function AdminMfaPage() {
  const check = await checkAdminSession()
  if (check.status === 'anonymous') redirect('/admin/login')
  if (check.status === 'admin') redirect('/admin')
  if (check.status === 'not_admin') redirect('/admin/login?error=not_admin')

  // Only allow-listed accounts may enrol a factor. The allowlist is readable
  // by the user for their own row (RLS), so this is a self-check.
  const supabase = await createClient()
  const { data: allowed } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', check.userId)
    .maybeSingle()
  if (!allowed) {
    await supabase.auth.signOut({ scope: 'global' })
    redirect('/admin/login?error=not_admin')
  }

  const { data: factors } = await supabase.auth.mfa.listFactors()
  const verified = factors?.totp.find((f) => f.status === 'verified') ?? null
  const unverified = factors?.all.filter((f) => f.status === 'unverified') ?? []

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center px-6 py-16">
      <h1 className="font-display text-3xl">Two-factor authentication</h1>
      <p className="mt-1 text-sm text-fg-muted">Signed in as {check.email}</p>
      <MfaGate
        mode={verified ? 'challenge' : 'enroll'}
        factorId={verified?.id ?? null}
        staleFactorIds={unverified.map((f) => f.id)}
      />
      <form action={signOut} className="mt-8 text-center">
        <button type="submit" className="text-sm text-fg-muted underline-offset-4 hover:underline">
          Sign out
        </button>
      </form>
    </main>
  )
}
