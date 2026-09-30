import 'server-only'

import { createAdminClient } from '@/lib/supabase/server'
import { env } from '@/lib/env'

export const MEDIA_BUCKET = 'project-media'
const MAX_BYTES = 5 * 1024 * 1024

type Kind = { mime: string; ext: string }

// Sniff the real type from the bytes; the browser-supplied MIME is ignored.
function sniff(bytes: Uint8Array): Kind | null {
  const b = bytes
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { mime: 'image/jpeg', ext: 'jpg' }
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return { mime: 'image/png', ext: 'png' }
  const ascii = (from: number, len: number) => String.fromCharCode(...b.slice(from, from + len))
  if (ascii(0, 4) === 'RIFF' && ascii(8, 4) === 'WEBP') return { mime: 'image/webp', ext: 'webp' }
  if (ascii(4, 4) === 'ftyp' && /avi[fs]|mif1/.test(ascii(8, 4))) return { mime: 'image/avif', ext: 'avif' }
  return null
}

export type UploadResult = { ok: true; path: string } | { ok: false; error: string }

// Validates and stores an image under `prefix/` and returns its storage path.
// Callers must have verified the admin session first (runAdminAction does).
export async function uploadImage(file: unknown, prefix: string, name: string): Promise<UploadResult> {
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: 'Choose an image file.' }
  if (file.size > MAX_BYTES) return { ok: false, error: 'Images must be 5 MB or smaller.' }
  const bytes = new Uint8Array(await file.arrayBuffer())
  const kind = sniff(bytes)
  if (!kind) return { ok: false, error: 'Only JPEG, PNG, WebP or AVIF images are accepted.' }

  const path = `${prefix}/${name}-${Date.now()}.${kind.ext}`
  const { error } = await createAdminClient()
    .storage.from(MEDIA_BUCKET)
    .upload(path, bytes, { contentType: kind.mime, upsert: false, cacheControl: '31536000' })
  if (error) return { ok: false, error: error.message }
  return { ok: true, path }
}

export async function removeImages(paths: string[]): Promise<void> {
  if (paths.length === 0) return
  const { error } = await createAdminClient().storage.from(MEDIA_BUCKET).remove(paths)
  if (error) console.error('[storage] remove failed:', error.message)
}

export async function removeFolder(prefix: string): Promise<void> {
  const client = createAdminClient()
  const { data } = await client.storage.from(MEDIA_BUCKET).list(prefix, { limit: 200 })
  const paths = (data ?? []).map((f) => `${prefix}/${f.name}`)
  await removeImages(paths)
}

export const publicImageUrl = (path: string) =>
  `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${MEDIA_BUCKET}/${path}`
