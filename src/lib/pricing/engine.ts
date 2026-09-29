// Pure pricing logic. Everything is stored in KWD with three decimals and
// converted only for display. No I/O here so it is trivially unit-tested.

export type PriceRange = { from: number; to: number }

export type CurrencyRate = {
  code: string
  symbol: string
  ratePerKwd: number
  /** Round converted amounts to the nearest multiple of this (e.g. 5 for USD). */
  rounding: number
  decimals: number
}

export type PricingMode = 'flat' | 'per_unit'

export type PriceFactor = {
  slug: string
  deltaFromKwd: number
  deltaToKwd: number
  pricingMode: PricingMode
  maxUnits?: number | null
}

export type FactorSelection = { slug: string; units?: number }

const clampUnits = (factor: PriceFactor, units: number | undefined) => {
  const requested = Number.isFinite(units) && units !== undefined ? Math.floor(units) : 1
  const max = factor.maxUnits ?? Number.MAX_SAFE_INTEGER
  return Math.min(Math.max(requested, 0), max)
}

/** Adds the selected factors on top of a base range. Unknown slugs are ignored. */
export function estimateRange(
  base: PriceRange,
  factors: readonly PriceFactor[],
  selections: readonly FactorSelection[],
): PriceRange {
  const bySlug = new Map(factors.map((f) => [f.slug, f]))
  let from = base.from
  let to = base.to
  const seen = new Set<string>()

  for (const selection of selections) {
    const factor = bySlug.get(selection.slug)
    if (!factor || seen.has(factor.slug)) continue
    seen.add(factor.slug)
    const multiplier = factor.pricingMode === 'per_unit' ? clampUnits(factor, selection.units) : 1
    from += factor.deltaFromKwd * multiplier
    to += factor.deltaToKwd * multiplier
  }

  return { from: round3(from), to: round3(Math.max(to, from)) }
}

export function round3(n: number) {
  return Math.round(n * 1000) / 1000
}

/** Converts a KWD amount to a display currency, rounded to the currency's step. */
export function convertFromKwd(amountKwd: number, currency: CurrencyRate): number {
  const raw = amountKwd * currency.ratePerKwd
  const step = currency.rounding > 0 ? currency.rounding : 1
  const rounded = Math.round(raw / step) * step
  const factor = 10 ** currency.decimals
  return Math.round(rounded * factor) / factor
}

export function convertRange(range: PriceRange, currency: CurrencyRate): PriceRange {
  return { from: convertFromKwd(range.from, currency), to: convertFromKwd(range.to, currency) }
}

const intlLocale = (locale: string) => (locale === 'ar' ? 'ar-KW-u-nu-latn' : 'en-KW')

const formatNumber = (amount: number, currency: CurrencyRate, locale: string) =>
  new Intl.NumberFormat(intlLocale(locale), {
    minimumFractionDigits: currency.decimals,
    maximumFractionDigits: currency.decimals,
  }).format(amount)

// Symbolic currency signs ($, €) sit directly before the number; alphabetic
// codes (KD, SAR, AED) read best as "KD 300" in English and "300 KD" in Arabic.
const isSign = (symbol: string) => symbol.length === 1 && !/\p{L}/u.test(symbol)

function withSymbol(text: string, currency: CurrencyRate, locale: string) {
  if (locale === 'ar') return `${text} ${currency.symbol}`
  return isSign(currency.symbol) ? `${currency.symbol}${text}` : `${currency.symbol} ${text}`
}

export function formatMoney(amount: number, currency: CurrencyRate, locale: string): string {
  return withSymbol(formatNumber(amount, currency, locale), currency, locale)
}

/** "KD 300 – 900" (en) or "300 – 900 KD" (ar). */
export function formatRange(range: PriceRange, currency: CurrencyRate, locale: string): string {
  if (range.from === range.to) return formatMoney(range.from, currency, locale)
  const from = formatNumber(range.from, currency, locale)
  const to = formatNumber(range.to, currency, locale)
  return withSymbol(`${from} \u2013 ${to}`, currency, locale)
}
