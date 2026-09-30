import Link from 'next/link'
import { requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { publicImageUrl } from '@/lib/storage/images'
import { Badge, EmptyState, LinkButton, PageHeader, Table } from '@/components/admin/ui'

export default async function ProjectsPage() {
  await requireAdmin()
  const supabase = await createClient()
  const { data, error } = await supabase.from('projects').select('id, title_en, tier, is_concept, featured, published, sort_order, cover_path, category:categories(name_en)').order('sort_order')
  if (error) throw error
  return (
    <>
      <PageHeader title="Projects" description="Your showcase. Concept projects fill the grid until client work is added." actions={<LinkButton href="/admin/projects/new" variant="primary">New project</LinkButton>} />
      {data.length === 0 ? (
        <EmptyState title="No projects yet." action={<LinkButton href="/admin/projects/new" variant="primary">Add the first one</LinkButton>} />
      ) : (
        <Table head={['', 'Title', 'Category', 'Tier', 'Flags', 'Order', 'Status']}>
          {data.map((r) => (
            <tr key={r.id} className="hover:bg-surface-hover">
              <td className="px-4 py-2">
                {r.cover_path ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={publicImageUrl(r.cover_path)} alt="" width={64} height={48} className="h-12 w-16 rounded object-cover object-top" />
                ) : (
                  <div className="h-12 w-16 rounded bg-surface" />
                )}
              </td>
              <td className="px-4 py-3"><Link href={`/admin/projects/${r.id}`} className="font-medium hover:text-gold">{r.title_en}</Link></td>
              <td className="px-4 py-3 text-fg-muted">{r.category?.name_en}</td>
              <td className="px-4 py-3 capitalize text-fg-muted">{r.tier}</td>
              <td className="px-4 py-3 flex gap-1">{r.is_concept && <Badge tone="gold">Concept</Badge>}{r.featured && <Badge>Featured</Badge>}</td>
              <td className="px-4 py-3 text-fg-muted">{r.sort_order}</td>
              <td className="px-4 py-3">{r.published ? <Badge tone="success">Published</Badge> : <Badge>Draft</Badge>}</td>
            </tr>
          ))}
        </Table>
      )}
    </>
  )
}
