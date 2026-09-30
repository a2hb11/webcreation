import { requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/admin/actions'

export default async function AdminHome() {
  const session = await requireAdmin()
  const supabase = await createClient()
  const [{ count: projects }, { count: newInquiries }] = await Promise.all([
    supabase.from('projects').select('id', { count: 'exact', head: true }),
    supabase.from('inquiries').select('id', { count: 'exact', head: true }).eq('status', 'new'),
  ])

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Dashboard</h1>
          <p className="text-sm text-fg-muted">{session.email}</p>
        </div>
        <form action={signOut}>
          <button type="submit" className="text-sm text-fg-muted underline-offset-4 hover:underline">
            Sign out
          </button>
        </form>
      </header>
      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-5">
          <p className="text-sm text-fg-muted">Projects</p>
          <p className="mt-1 text-3xl">{projects ?? 0}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-5">
          <p className="text-sm text-fg-muted">New inquiries</p>
          <p className="mt-1 text-3xl">{newInquiries ?? 0}</p>
        </div>
      </section>
    </main>
  )
}
