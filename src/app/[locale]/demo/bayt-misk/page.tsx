import { Link } from '@/i18n/navigation'
import { L, getDemoLocale } from '@/components/demo/shell'
import { families, products } from '@/demos/bayt-misk/data'
import { Bottle } from '@/demos/bayt-misk/bottle'

export default async function MiskHome() {
  const l = await getDemoLocale()
  return (
    <div className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
      <section className="relative grid items-center gap-10 overflow-hidden rounded-demo border border-demo-line bg-[radial-gradient(60%_80%_at_70%_30%,#3b1f14_0%,transparent_70%)] p-8 sm:p-14 lg:grid-cols-2">
        <div>
          <p className="text-sm tracking-[0.2em] text-demo-accent uppercase rtl:tracking-normal">{L(l, 'Kuwait · Since 2019', 'الكويت · منذ 2019')}</p>
          <h1 className="font-demo-display mt-4 text-5xl leading-tight sm:text-6xl">{L(l, 'Oud, musk and amber, composed in Kuwait.', 'عود ومسك وعنبر بتركيبة كويتية.')}</h1>
          <p className="mt-5 max-w-md text-demo-muted">{L(l, 'Eight compositions, blended in small batches and aged for ninety days before bottling.', 'ثماني تركيبات، تُمزج بدفعات صغيرة وتُعتَّق تسعين يومًا قبل التعبئة.')}</p>
          <Link href="/demo/bayt-misk/shop" className="mt-8 inline-block rounded-demo bg-demo-accent px-6 py-3 text-sm font-semibold text-demo-on-accent">{L(l, 'Shop the collection', 'تسوّق المجموعة')}</Link>
        </div>
        <div className="flex justify-center gap-6">
          {products.slice(0, 3).map((p) => <Bottle key={p.slug} hue={p.hue} className="w-24 sm:w-32" />)}
        </div>
      </section>
      <section className="py-14">
        <h2 className="font-demo-display text-3xl">{L(l, 'By note family', 'حسب عائلة الرائحة')}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          {Object.entries(families).map(([k, v]) => (
            <Link key={k} href={`/demo/bayt-misk/shop`} className="rounded-demo border border-demo-line bg-demo-surface p-6 hover:border-demo-accent">
              <p className="font-demo-display text-2xl">{v[l]}</p>
              <p className="mt-1 text-xs text-demo-muted tnum">{products.filter((p) => p.family === k).length} {L(l, 'scents', 'عطور')}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
