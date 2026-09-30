import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { L, getDemoLocale, kwd } from '@/components/demo/shell'
import { chalets } from '@/demos/marsa-chalets/data'
import { Calendar } from '@/demos/marsa-chalets/calendar'

export default async function ChaletPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const c = chalets.find((x) => x.slug === slug)
  if (!c) notFound()
  const l = await getDemoLocale()
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-8 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <h1 className="font-demo-display text-4xl font-semibold">{c[l]}</h1>
        <p className="mt-2 text-demo-muted">{l === 'ar' ? c.tag_ar : c.tag_en} · {L(l, `up to ${c.capacity} guests`, `حتى ${c.capacity} ضيفًا`)}</p>
        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
          {c.amenities.map(([en, ar]) => <li key={en} className="rounded-demo border border-demo-line bg-demo-surface px-4 py-3 text-sm">{L(l, en, ar)}</li>)}
        </ul>
        <table className="mt-8 w-full text-sm">
          <thead><tr className="text-start text-demo-muted"><th className="py-2 text-start">{L(l, 'Season', 'الموسم')}</th><th className="py-2 text-start">{L(l, 'Per night', 'لكل ليلة')}</th></tr></thead>
          <tbody className="divide-y divide-demo-line">
            <tr><td className="py-2">{L(l, 'Sat–Wed nights', 'ليالي السبت–الأربعاء')}</td><td className="py-2 tnum" dir="ltr">{kwd(c.weekday, l)}</td></tr>
            <tr><td className="py-2">{L(l, 'Thu & Fri nights', 'ليلتا الخميس والجمعة')}</td><td className="py-2 tnum" dir="ltr">{kwd(c.weekend, l)}</td></tr>
            <tr><td className="py-2">{L(l, 'Eid & National Day', 'العيد واليوم الوطني')}</td><td className="py-2 tnum" dir="ltr">{kwd(c.holiday, l)}</td></tr>
          </tbody>
        </table>
        <Link href={{ pathname: '/demo/marsa-chalets/book', query: { chalet: c.slug } }} className="mt-8 inline-block rounded-demo bg-demo-accent px-6 py-3 text-sm font-semibold text-demo-on-accent">{L(l, 'Book this chalet', 'احجز هذا الشاليه')}</Link>
      </div>
      <Calendar slug={c.slug} locale={l} />
    </div>
  )
}
