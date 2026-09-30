import { notFound } from 'next/navigation'
import { L, getDemoLocale } from '@/components/demo/shell'
import { families, products } from '@/demos/bayt-misk/data'
import { Bottle } from '@/demos/bayt-misk/bottle'
import { ProductClient } from '@/demos/bayt-misk/product-client'

export default async function MiskProduct({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = products.find((p) => p.slug === slug)
  if (!product) notFound()
  const l = await getDemoLocale()
  const n = (pair: [string, string]) => (l === 'ar' ? pair[1] : pair[0])
  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-5 py-8 sm:px-8 lg:grid-cols-2">
      <div className="grid aspect-square place-items-center rounded-demo border border-demo-line bg-demo-surface">
        <Bottle hue={product.hue} className="w-1/2" />
      </div>
      <div>
        <p className="text-sm text-demo-muted">{families[product.family][l]} · ★ <span className="tnum">{product.rating}</span></p>
        <h1 className="font-demo-display mt-2 text-5xl">{product[l]}</h1>
        <dl className="mt-6 grid grid-cols-3 gap-4 border-y border-demo-line py-5 text-sm">
          {(['top', 'heart', 'base'] as const).map((k) => (
            <div key={k}><dt className="text-xs text-demo-muted uppercase rtl:normal-case">{{ top: L(l, 'Top', 'مقدمة'), heart: L(l, 'Heart', 'قلب'), base: L(l, 'Base', 'قاعدة') }[k]}</dt><dd className="mt-1">{n(product.notes[k])}</dd></div>
          ))}
        </dl>
        <div className="mt-6"><ProductClient product={product} locale={l} /></div>
        <section className="mt-10">
          <h2 className="font-demo-display text-2xl">{L(l, 'Reviews', 'التقييمات')}</h2>
          <p className="mt-2 text-sm text-demo-muted">{L(l, 'Review submissions are disabled in this concept demo. In production, verified buyers leave a rating and a short note after delivery.', 'إضافة التقييمات معطلة في هذا النموذج التجريبي. في الإنتاج يترك المشترون المؤكدون تقييمًا وملاحظة قصيرة بعد التوصيل.')}</p>
        </section>
      </div>
    </div>
  )
}
