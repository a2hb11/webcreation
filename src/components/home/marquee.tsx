import { getLocale } from 'next-intl/server'
import { getCategories } from '@/lib/data/public'

export async function CategoryMarquee() {
  const [categories, locale] = await Promise.all([getCategories(), getLocale()])
  if (categories.length === 0) return null
  const items = categories.map((c) => (locale === 'ar' ? c.name_ar : c.name_en))
  const track = [...items, ...items]
  return (
    <div className="relative overflow-hidden border-y border-border-1 bg-bg-1 py-4 [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]" aria-hidden>
      <div className="marquee-track gap-8">
        {track.map((label, i) => (
          <span key={i} className="font-display flex items-center gap-8 text-2xl text-text-2 whitespace-nowrap">
            {label}
            <svg viewBox="0 0 12 12" className="size-2 text-gold-500">
              <path d="M6 0l6 6-6 6-6-6z" fill="currentColor" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  )
}
