import { convertRange, formatRange, type CurrencyRate, type PriceRange } from '@/lib/pricing/engine'

// Renders a KWD range in the visitor's currency, isolated so the dash never
// flips in RTL. Server-only formatting: no client JS involved.
export function PriceRangeText({ range, currency, locale, className = '' }: { range: PriceRange; currency: CurrencyRate; locale: string; className?: string }) {
  const text = formatRange(convertRange(range, currency), currency, locale)
  return (
    <bdi dir="ltr" className={`tnum ${className}`}>
      {text}
    </bdi>
  )
}

export const toRange = (from: number | string, to: number | string): PriceRange => ({ from: Number(from), to: Number(to) })
