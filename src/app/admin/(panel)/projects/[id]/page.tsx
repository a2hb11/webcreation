import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { isUuid, noticeFrom } from '@/lib/admin/crud'
import { toBilingualLines } from '@/lib/admin/form'
import { publicImageUrl } from '@/lib/storage/images'
import { PageHeader } from '@/components/admin/ui'
import { EntityForm } from '@/components/admin/entity-form'
import { deleteProject, saveProject } from '../actions'
import { projectRows } from '../fields'
import { ProjectImages } from './project-images'

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string; error?: string }> }

export default async function EditProjectPage({ params, searchParams }: Props) {
  await requireAdmin()
  const { id } = await params
  if (!isUuid(id)) notFound()
  const supabase = await createClient()
  const [{ data: row }, { data: categories }, { data: images }] = await Promise.all([
    supabase.from('projects').select('*').eq('id', id).maybeSingle(),
    supabase.from('categories').select('id, name_en').order('sort_order'),
    supabase.from('project_images').select('id, path, alt_en, alt_ar, sort_order').eq('project_id', id).order('sort_order'),
  ])
  if (!row) notFound()
  const search = await searchParams
  const notice = noticeFrom(search) ?? (search.saved ? { status: 'success' as const, message: search.saved } : undefined)
  return (
    <>
      <PageHeader title={row.title_en} description={`/work/${row.slug}`} />
      <EntityForm
        rows={projectRows((categories ?? []).map((c) => ({ value: c.id, label: c.name_en })))}
        values={{ ...row, features: toBilingualLines(row.features), tech_stack: row.tech_stack.join(', ') }}
        id={row.id}
        action={saveProject}
        deleteAction={deleteProject}
        entityLabel="project"
        deleteNote="Deletes the project, its images and any testimonials' link to it."
        notice={notice}
      />
      <ProjectImages
        projectId={row.id}
        coverUrl={row.cover_path ? publicImageUrl(row.cover_path) : null}
        images={(images ?? []).map((i) => ({ ...i, url: publicImageUrl(i.path) }))}
      />
    </>
  )
}
