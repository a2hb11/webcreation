'use server'

import type { Route } from 'next'
import { updateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { dbErrorMessage, runAdminAction } from '@/lib/admin/action'
import { makeSave } from '@/lib/admin/crud'
import { bilingualLines, checkbox, number, optional, text, zBilingual, zInt, zMoney, zOptionalText, zSlug, zText, zUuid } from '@/lib/admin/form'
import type { ActionState } from '@/lib/admin/types'
import { cacheTags } from '@/lib/data/public'
import { removeFolder, removeImages, uploadImage } from '@/lib/storage/images'

const emptyToNull = (max: number, regex?: RegExp, message?: string) =>
  z
    .string()
    .trim()
    .max(max)
    .refine((v) => v === '' || !regex || regex.test(v), message ?? 'invalid value')
    .transform((v) => v || null)

const schema = z
  .object({
    id: zUuid.optional(),
    slug: zSlug,
    category_id: zUuid,
    tier: z.enum(['starter', 'professional', 'elite']),
    title_en: zText(140),
    title_ar: zText(140),
    summary_en: zOptionalText(300),
    summary_ar: zOptionalText(300),
    body_en: zOptionalText(5000),
    body_ar: zOptionalText(5000),
    client_name: emptyToNull(120),
    is_concept: z.boolean(),
    live_url: emptyToNull(300, /^https:\/\/\S+$/, 'must start with https://'),
    demo_route: emptyToNull(80, /^\/demo\/[a-z0-9-]+$/, 'must look like /demo/my-demo'),
    price_from_kwd: zMoney,
    price_to_kwd: zMoney,
    duration_days: z.coerce.number().int().min(1).max(1000).optional().nullable(),
    features: zBilingual,
    tech_stack: z.array(z.string().trim().min(1).max(40)).max(20),
    accent_color: emptyToNull(7, /^#[0-9a-fA-F]{6}$/, 'hex colour like #C9A96A'),
    featured: z.boolean(),
    published: z.boolean(),
    sort_order: zInt(0, 10_000).default(0),
  })
  .refine((d) => d.price_to_kwd >= d.price_from_kwd, { path: ['price_to_kwd'], message: 'must be ≥ the "from" price' })

const save = makeSave({ table: 'projects', schema, tags: [cacheTags.projects], route: '/admin/projects', uniqueMessage: 'A project with this slug already exists.' })

export async function saveProject(_prev: ActionState, fd: FormData): Promise<ActionState> {
  return save({
    id: optional(fd, 'id'),
    slug: text(fd, 'slug'),
    category_id: text(fd, 'category_id'),
    tier: text(fd, 'tier'),
    title_en: text(fd, 'title_en'),
    title_ar: text(fd, 'title_ar'),
    summary_en: optional(fd, 'summary_en'),
    summary_ar: optional(fd, 'summary_ar'),
    body_en: optional(fd, 'body_en'),
    body_ar: optional(fd, 'body_ar'),
    client_name: text(fd, 'client_name'),
    is_concept: checkbox(fd, 'is_concept'),
    live_url: text(fd, 'live_url'),
    demo_route: text(fd, 'demo_route'),
    price_from_kwd: number(fd, 'price_from_kwd'),
    price_to_kwd: number(fd, 'price_to_kwd'),
    duration_days: number(fd, 'duration_days') ?? null,
    features: bilingualLines(fd, 'features'),
    tech_stack: text(fd, 'tech_stack').split(',').map((s) => s.trim()).filter(Boolean),
    accent_color: text(fd, 'accent_color'),
    featured: checkbox(fd, 'featured'),
    published: checkbox(fd, 'published'),
    sort_order: number(fd, 'sort_order'),
  })
}

const idOnly = z.object({ id: zUuid })
const back = (id: string, msg?: { saved?: string; error?: string }) => {
  const q = msg?.error ? `?error=${encodeURIComponent(msg.error)}` : msg?.saved ? `?saved=${encodeURIComponent(msg.saved)}` : ''
  redirect(`/admin/projects/${id}${q}` as Route)
}

export async function deleteProject(fd: FormData): Promise<void> {
  const id = text(fd, 'id')
  const result = await runAdminAction(idOnly, { id }, async ({ id }, { supabase }) => {
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) return { status: 'error', message: dbErrorMessage(error) }
    await removeFolder(`projects/${id}`)
    updateTag(cacheTags.projects)
    return { status: 'success' }
  })
  if (result.status === 'error') back(id, { error: result.message })
  redirect('/admin/projects')
}

export async function uploadCover(fd: FormData): Promise<void> {
  const id = text(fd, 'id')
  const result = await runAdminAction(idOnly, { id }, async ({ id }, { supabase }) => {
    // Confirm the row is reachable under RLS before touching storage.
    const { data: project } = await supabase.from('projects').select('cover_path').eq('id', id).maybeSingle()
    if (!project) return { status: 'error', message: 'Project not found.' }
    const up = await uploadImage(fd.get('file'), `projects/${id}`, 'cover')
    if (!up.ok) return { status: 'error', message: up.error }
    const { error } = await supabase.from('projects').update({ cover_path: up.path }).eq('id', id)
    if (error) {
      await removeImages([up.path])
      return { status: 'error', message: dbErrorMessage(error) }
    }
    if (project.cover_path) await removeImages([project.cover_path])
    updateTag(cacheTags.projects)
    return { status: 'success' }
  })
  back(id, result.status === 'error' ? { error: result.message } : { saved: 'Cover updated.' })
}

export async function addGalleryImage(fd: FormData): Promise<void> {
  const id = text(fd, 'id')
  const schema = z.object({ id: zUuid, alt_en: z.string().trim().max(160), alt_ar: z.string().trim().max(160) })
  const result = await runAdminAction(schema, { id, alt_en: text(fd, 'alt_en'), alt_ar: text(fd, 'alt_ar') }, async ({ id, alt_en, alt_ar }, { supabase }) => {
    const { data: project } = await supabase.from('projects').select('id').eq('id', id).maybeSingle()
    if (!project) return { status: 'error', message: 'Project not found.' }
    const { data: last } = await supabase.from('project_images').select('sort_order').eq('project_id', id).order('sort_order', { ascending: false }).limit(1).maybeSingle()
    const up = await uploadImage(fd.get('file'), `projects/${id}`, 'gallery')
    if (!up.ok) return { status: 'error', message: up.error }
    const { error } = await supabase.from('project_images').insert({ project_id: id, path: up.path, alt_en, alt_ar, sort_order: (last?.sort_order ?? 0) + 1 })
    if (error) {
      await removeImages([up.path])
      return { status: 'error', message: dbErrorMessage(error) }
    }
    updateTag(cacheTags.projects)
    return { status: 'success' }
  })
  back(id, result.status === 'error' ? { error: result.message } : { saved: 'Image added.' })
}

export async function removeGalleryImage(fd: FormData): Promise<void> {
  const id = text(fd, 'id')
  const schema = z.object({ id: zUuid, imageId: zUuid })
  const result = await runAdminAction(schema, { id, imageId: text(fd, 'imageId') }, async ({ id, imageId }, { supabase }) => {
    const { data: image } = await supabase.from('project_images').select('path').eq('id', imageId).eq('project_id', id).maybeSingle()
    if (!image) return { status: 'error', message: 'Image not found.' }
    const { error } = await supabase.from('project_images').delete().eq('id', imageId)
    if (error) return { status: 'error', message: dbErrorMessage(error) }
    await removeImages([image.path])
    updateTag(cacheTags.projects)
    return { status: 'success' }
  })
  back(id, result.status === 'error' ? { error: result.message } : { saved: 'Image removed.' })
}
