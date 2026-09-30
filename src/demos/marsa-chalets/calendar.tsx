import { blocked } from '@/demos/marsa-chalets/data'
import { isWeekendNight, HOLIDAYS } from '@/demos/marsa-chalets/pricing'

// October 2026 availability grid, server-rendered. Week starts Saturday.
export function Calendar({ slug, locale }: { slug: string; locale: 'en' | 'ar' }) {
  const days = Array.from({ length: 31 }, (_, i) => `2026-10-${String(i + 1).padStart(2, '0')}`)
  const firstDow = new Date('2026-10-01T00:00:00Z').getUTCDay() // 4 = Thu
  const offset = (firstDow + 1) % 7 // Saturday-first grid
  const heads = locale === 'ar' ? ['س', 'ح', 'ن', 'ث', 'ر', 'خ', 'ج'] : ['Sa', 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr']
  return (
    <div className="rounded-demo border border-demo-line bg-demo-surface p-4">
      <p className="mb-3 text-sm font-semibold">{locale === 'ar' ? 'أكتوبر 2026' : 'October 2026'}</p>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {heads.map((h) => <span key={h} className="py-1 text-demo-muted">{h}</span>)}
        {Array.from({ length: offset }).map((_, i) => <span key={`o${i}`} />)}
        {days.map((d) => {
          const taken = blocked[slug]?.includes(d)
          const holiday = HOLIDAYS.has(d)
          const weekend = isWeekendNight(d)
          return (
            <span key={d} className={`rounded-md py-1.5 tnum ${taken ? 'bg-demo-line text-demo-muted line-through' : holiday ? 'bg-demo-accent-2/20 text-demo-fg' : weekend ? 'bg-demo-accent/10 text-demo-accent' : 'text-demo-fg'}`}>{Number(d.slice(8))}</span>
          )
        })}
      </div>
      <p className="mt-3 flex flex-wrap gap-3 text-xs text-demo-muted">
        <span><span className="inline-block size-2 rounded bg-demo-accent/30" /> {locale === 'ar' ? 'نهاية أسبوع' : 'weekend'}</span>
        <span><span className="inline-block size-2 rounded bg-demo-accent-2/40" /> {locale === 'ar' ? 'عطلة' : 'holiday'}</span>
        <span><span className="inline-block size-2 rounded bg-demo-line" /> {locale === 'ar' ? 'محجوز' : 'booked'}</span>
      </p>
    </div>
  )
}
