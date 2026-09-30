// Cover paths are either app-relative (committed concept covers, "/demos/…")
// or Supabase Storage object paths (uploaded from the admin).
export function mediaUrl(path: string | null | undefined, supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL): string | null {
  if (!path) return null
  if (path.startsWith('/')) return path
  return `${supabaseUrl}/storage/v1/object/public/project-media/${path}`
}
