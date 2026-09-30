import { L, getDemoLocale } from '@/components/demo/shell'
import { ShopClient } from '@/demos/bayt-misk/shop-client'

export default async function MiskShop() {
  const l = await getDemoLocale()
  return (
    <div className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
      <h1 className="font-demo-display py-6 text-4xl">{L(l, 'The collection', 'المجموعة')}</h1>
      <ShopClient locale={l} />
    </div>
  )
}
