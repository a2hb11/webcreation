-- Public media bucket for project covers / gallery images.
--
-- Uploads are performed server-side (admin-only Server Action using the
-- service role after validating type, size and content), so no client-side
-- write policy exists: visitors and signed-in users can only read.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-media',
  'project-media',
  true,
  5 * 1024 * 1024,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "project_media_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'project-media');
