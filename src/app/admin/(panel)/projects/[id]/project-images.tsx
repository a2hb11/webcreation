import { Button, Field, Input } from '@/components/admin/ui'
import { addGalleryImage, removeGalleryImage, uploadCover } from '../actions'

type Img = { id: string; url: string; alt_en: string; alt_ar: string }

// Server Component: plain multipart forms posting to Server Actions.
export function ProjectImages({ projectId, coverUrl, images }: { projectId: string; coverUrl: string | null; images: Img[] }) {
  return (
    <section className="mt-12 grid gap-8 lg:grid-cols-2">
      <div className="rounded-lg border border-border p-5">
        <h2 className="mb-3 font-medium">Cover image</h2>
        <p className="mb-4 text-sm text-fg-muted">Full-page screenshot, 1440 px wide, 4:3 or taller. JPEG, PNG, WebP or AVIF up to 5 MB.</p>
        {coverUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverUrl} alt="Current cover" className="mb-4 aspect-[4/3] w-full rounded-md border border-border object-cover object-top" />
        )}
        <form action={uploadCover} className="flex flex-col gap-3">
          <input type="hidden" name="id" value={projectId} />
          <Input type="file" name="file" accept="image/jpeg,image/png,image/webp,image/avif" required />
          <Button type="submit" variant="ghost">{coverUrl ? 'Replace cover' : 'Upload cover'}</Button>
        </form>
      </div>
      <div className="rounded-lg border border-border p-5">
        <h2 className="mb-3 font-medium">Gallery</h2>
        {images.length > 0 && (
          <ul className="mb-5 grid grid-cols-2 gap-3">
            {images.map((img) => (
              <li key={img.id} className="rounded-md border border-border p-2 text-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.alt_en} className="mb-2 aspect-[4/3] w-full rounded object-cover object-top" />
                <p className="truncate text-fg-muted">{img.alt_en || '(no alt text)'}</p>
                <form action={removeGalleryImage} className="mt-2">
                  <input type="hidden" name="id" value={projectId} />
                  <input type="hidden" name="imageId" value={img.id} />
                  <button type="submit" className="text-error underline-offset-2 hover:underline">Remove</button>
                </form>
              </li>
            ))}
          </ul>
        )}
        <form action={addGalleryImage} className="flex flex-col gap-3">
          <input type="hidden" name="id" value={projectId} />
          <Input type="file" name="file" accept="image/jpeg,image/png,image/webp,image/avif" required />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Alt text (English)"><Input name="alt_en" maxLength={160} /></Field>
            <Field label="Alt text (Arabic)"><Input name="alt_ar" maxLength={160} dir="rtl" /></Field>
          </div>
          <Button type="submit" variant="ghost">Add image</Button>
        </form>
      </div>
    </section>
  )
}
