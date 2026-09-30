import { L, getDemoLocale } from '@/components/demo/shell'
import { CheckoutClient } from '@/demos/bayt-misk/checkout-client'

export default async function MiskCheckout() {
  const l = await getDemoLocale()
  return (
    <div className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
      <h1 className="font-demo-display py-6 text-4xl">{L(l, 'Checkout', 'إتمام الشراء')}</h1>
      <CheckoutClient locale={l} />
    </div>
  )
}
