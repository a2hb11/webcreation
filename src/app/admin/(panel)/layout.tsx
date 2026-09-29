import Link from 'next/link'
import { requireAdmin } from '@/lib/auth/admin'
import { signOut } from '@/app/admin/actions'

const nav = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/inquiries', label: 'Inquiries' },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/packages', label: 'Packages' },
  { href: '/admin/price-factors', label: 'Price factors' },
  { href: '/admin/maintenance-plans', label: 'Maintenance plans' },
  { href: '/admin/currencies', label: 'Currencies' },
  { href: '/admin/faqs', label: 'FAQs' },
  { href: '/admin/testimonials', label: 'Testimonials' },
  { href: '/admin/settings', label: 'Settings' },
  { href: '/admin/audit-log', label: 'Audit log' },
] as const

// Every page under the panel is admin-only. Pages and actions re-check the
// session themselves; this layout is the navigation shell.
export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin()

  return (
    <div className="flex min-h-dvh">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-bg-elevated p-4 md:flex">
        <Link href="/admin" className="font-display px-2 text-2xl">
          Noxaur
        </Link>
        <p className="mb-6 px-2 text-xs text-fg-subtle">Admin</p>
        <nav className="flex flex-col gap-0.5">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2 py-1.5 text-sm text-fg-muted transition hover:bg-surface-hover hover:text-fg"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto px-2 pt-6">
          <p className="truncate text-xs text-fg-subtle">{session.email}</p>
          <form action={signOut}>
            <button type="submit" className="mt-1 text-xs text-fg-muted underline-offset-4 hover:underline">
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3 overflow-x-auto border-b border-border px-4 py-2 md:hidden">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="whitespace-nowrap text-sm text-fg-muted">
              {item.label}
            </Link>
          ))}
        </div>
        <main className="mx-auto w-full max-w-6xl px-6 py-10">{children}</main>
      </div>
    </div>
  )
}
