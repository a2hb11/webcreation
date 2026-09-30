import { Link } from '@/i18n/navigation'
import { L, getDemoLocale } from '@/components/demo/shell'
import { branches, roasts } from '@/demos/sahwa-roasters/data'

export default async function SahwaHome() {
  const l = await getDemoLocale()
  return (
    <div className="mx-auto max-w-5xl px-5 pb-20 sm:px-8">
      <section className="grid items-center gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm text-demo-accent-2">{L(l, 'Specialty roastery · Salmiya & Kuwait City', 'محمصة مختصة · السالمية ومدينة الكويت')}</p>
          <h1 className="font-demo-display mt-3 text-5xl font-semibold leading-[1.05] sm:text-6xl">{L(l, 'Kuwait-roasted, single origin.', 'محمّصة في الكويت، أصل واحد.')}</h1>
          <p className="mt-5 max-w-md text-lg text-demo-muted">{L(l, 'Small batches roasted every Sunday, poured by people who know the farm each bean came from.', 'دفعات صغيرة تُحمَّص كل أحد، ويقدّمها أشخاص يعرفون المزرعة التي جاءت منها كل حبة.')}</p>
          <Link href="/demo/sahwa-roasters/menu" className="mt-8 inline-block rounded-demo bg-demo-accent px-6 py-3 font-medium text-demo-on-accent">{L(l, 'Open the menu', 'افتح القائمة')}</Link>
        </div>
        <svg viewBox="0 0 320 320" className="mx-auto w-72" aria-hidden>
          <circle cx="160" cy="160" r="150" fill="#efe3d3" />
          <path d="M100 150c0-40 30-60 60-60s60 20 60 60v20c0 40-30 70-60 70s-60-30-60-70z" fill="#5b3a2a" />
          <path d="M160 100c-10 30-10 60 0 90" stroke="#efe3d3" strokeWidth="6" strokeLinecap="round" />
          <path d="M60 250c40 20 160 20 200 0" stroke="#c8552a" strokeWidth="8" strokeLinecap="round" fill="none" />
        </svg>
      </section>
      <section className="py-10">
        <h2 className="font-demo-display text-3xl font-semibold">{L(l, 'Three roast levels', 'ثلاثة مستويات تحميص')}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {roasts.map((r) => (
            <div key={r.en} className="flex items-center gap-4 rounded-demo border border-demo-line bg-demo-surface p-5">
              <span className="size-12 shrink-0 rounded-full shadow-inner" style={{ background: r.color }} />
              <div>
                <p className="font-semibold">{r[l]}</p>
                <p className="text-sm text-demo-muted">{l === 'ar' ? r.note_ar : r.note_en}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="py-10">
        <h2 className="font-demo-display text-3xl font-semibold">{L(l, 'Branches', 'الفروع')}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {branches.map((b) => (
            <div key={b.id} className="rounded-demo border border-demo-line bg-demo-surface p-5">
              <p className="font-semibold">{b[l]}</p>
              <p className="mt-1 text-sm text-demo-muted tnum" dir="ltr">{b.hours}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
