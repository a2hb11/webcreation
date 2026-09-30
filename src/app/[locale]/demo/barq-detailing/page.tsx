import { L, demoWhatsApp, kwd, getDemoLocale } from '@/components/demo/shell'
import { faqs, packages } from '@/demos/barq-detailing/data'
import { GlossSlider } from '@/demos/barq-detailing/slider'

export default async function BarqPage() {
  const l = await getDemoLocale()
  const slots = ['Sat 6:00 pm', 'Sun 8:30 pm', 'Mon 5:00 pm']
  return (
    <div className="mx-auto max-w-6xl px-5 pb-28 sm:px-8">
      <header className="flex items-center justify-between py-6">
        <p className="font-demo-display text-lg font-bold tracking-tight text-demo-accent">BARQ<span className="text-demo-fg">.</span></p>
        <a href={demoWhatsApp(L(l, 'Hi Barq, I want to book detailing', 'مرحبًا برق، أرغب في حجز تلميع'))} className="rounded-demo border border-demo-line px-4 py-2 text-sm hover:border-demo-accent">{L(l, 'WhatsApp', 'واتساب')}</a>
      </header>
      <section className="grid items-center gap-10 py-10 lg:grid-cols-2">
        <div>
          <p className="text-sm text-demo-accent">{L(l, 'Shuwaikh Industrial · Ceramic · PPF', 'الشويخ الصناعية · سيراميك · فيلم حماية')}</p>
          <h1 className="font-demo-display mt-4 text-4xl font-bold leading-tight sm:text-6xl">{L(l, 'Showroom shine, in Shuwaikh.', 'لمعة المعرض، في الشويخ.')}</h1>
          <p className="mt-5 max-w-md text-demo-muted">{L(l, 'Paint correction, 9H ceramic and self-healing film by two certified detailers. Book a slot on WhatsApp in under a minute.', 'تصحيح طلاء وسيراميك 9H وفيلم ذاتي الإصلاح على يد فنيَّين معتمدَين. احجز موعدك على واتساب في أقل من دقيقة.')}</p>
          <div className="mt-8 flex gap-3">
            <a href="#packages" className="rounded-demo bg-demo-accent px-5 py-3 text-sm font-semibold text-demo-on-accent">{L(l, 'See packages', 'الباقات')}</a>
            <a href="#slots" className="rounded-demo border border-demo-line px-5 py-3 text-sm">{L(l, 'Next slot', 'أقرب موعد')}</a>
          </div>
        </div>
        <GlossSlider before={L(l, 'Before', 'قبل')} after={L(l, 'After ceramic', 'بعد السيراميك')} />
      </section>
      <section id="slots" className="my-8 flex flex-wrap items-center gap-3 rounded-demo border border-demo-line bg-demo-surface px-5 py-4 text-sm">
        <span className="flex items-center gap-2 text-demo-muted"><span className="size-2 animate-pulse rounded-full bg-demo-accent" />{L(l, 'Next available', 'المواعيد المتاحة')}</span>
        {slots.map((s) => (
          <span key={s} className="rounded-demo border border-demo-line px-3 py-1 tnum" dir="ltr">{s}</span>
        ))}
      </section>
      <section id="packages" className="py-12">
        <h2 className="font-demo-display text-2xl font-bold">{L(l, 'Packages', 'الباقات')}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {packages.map((p) => (
            <article key={p.id} className={`flex flex-col rounded-demo border p-6 ${'featured' in p && p.featured ? 'border-demo-accent bg-demo-surface shadow-[0_0_60px_-30px_rgb(34_211_238/0.6)]' : 'border-demo-line'}`}>
              <h3 className="font-demo-display text-lg font-bold">{p[l].name}</h3>
              <p className="mt-2 text-3xl tnum" dir="ltr">{kwd(p.price, l)}</p>
              <p className="text-xs text-demo-muted tnum">{L(l, `~${p.hours} h`, `~${p.hours} ساعة`)}</p>
              <ul className="mt-4 flex flex-col gap-1.5 text-sm text-demo-muted">
                {p[l].items.map((i) => <li key={i}>· {i}</li>)}
              </ul>
              <a href={demoWhatsApp(L(l, `Hi Barq, I'd like to book: ${p.en.name} (${kwd(p.price, 'en')})`, `مرحبًا برق، أرغب في حجز: ${p.ar.name} (${kwd(p.price, 'ar')})`))} className="mt-6 rounded-demo bg-demo-accent px-4 py-2.5 text-center text-sm font-semibold text-demo-on-accent">{L(l, 'Book on WhatsApp', 'احجز عبر واتساب')}</a>
            </article>
          ))}
        </div>
      </section>
      <section className="py-8">
        <h2 className="font-demo-display text-2xl font-bold">{L(l, 'Questions', 'أسئلة')}</h2>
        <div className="mt-4 divide-y divide-demo-line border-y border-demo-line">
          {faqs.map((f, i) => (
            <details key={i} className="py-4">
              <summary className="cursor-pointer font-medium">{f[l][0]}</summary>
              <p className="mt-2 text-sm text-demo-muted">{f[l][1]}</p>
            </details>
          ))}
        </div>
      </section>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-demo-line bg-demo-bg/90 p-3 backdrop-blur sm:hidden">
        <a href={demoWhatsApp(L(l, 'Hi Barq, I want to book detailing', 'مرحبًا برق، أرغب في حجز تلميع'))} className="block rounded-demo bg-demo-accent py-3 text-center text-sm font-semibold text-demo-on-accent">{L(l, 'Book on WhatsApp', 'احجز عبر واتساب')}</a>
      </div>
    </div>
  )
}
