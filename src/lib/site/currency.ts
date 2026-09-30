import 'server-only'

import { cookies } from 'next/headers'
import { getCurrencies, getDefaultCurrency, type Currency } from '@/lib/data/public'
import type { CurrencyRate } from '@/lib/pricing/engine'

export const CURRENCY_COOKIE = 'currency'

export const toRate = (c: Currency): CurrencyRate => ({
  code: c.code,
  symbol: c.symbol,
  symbolAr: c.symbol_ar || undefined,
  ratePerKwd: Number(c.rate_per_kwd),
  rounding: Number(c.rounding),
  decimals: c.decimals,
})

// The visitor's currency, from the cookie set by the switcher, else the default.
export async function getSelectedCurrency(): Promise<{ current: CurrencyRate; all: CurrencyRate[] }> {
  const [currencies, fallback, cookieStore] = await Promise.all([getCurrencies(), getDefaultCurrency(), cookies()])
  const wanted = cookieStore.get(CURRENCY_COOKIE)?.value
  const chosen = currencies.find((c) => c.code === wanted) ?? fallback ?? currencies[0]
  const current = chosen
    ? toRate(chosen)
    : { code: 'KWD', symbol: 'KD', symbolAr: 'د.ك', ratePerKwd: 1, rounding: 1, decimals: 0 }
  return { current, all: currencies.map(toRate) }
}
