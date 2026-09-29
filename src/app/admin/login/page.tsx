import { redirect } from 'next/navigation'
import { checkAdminSession } from '@/lib/auth/admin'
import { LoginForm } from '@/components/admin/login-form'

type Props = { searchParams: Promise<{ error?: string }> }

export default async function AdminLoginPage({ searchParams }: Props) {
  const check = await checkAdminSession()
  if (check.status === 'admin') redirect('/admin')
  if (check.status === 'needs_mfa') redirect('/admin/mfa')

  const { error } = await searchParams
  const notice =
    error === 'not_admin' || check.status === 'not_admin'
      ? 'This account is not allowed to manage the site.'
      : undefined

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center px-6 py-16">
      <h1 className="font-display text-3xl">Sign in</h1>
      <p className="mt-1 text-sm text-fg-muted">Owner access only.</p>
      <LoginForm notice={notice} />
    </main>
  )
}
