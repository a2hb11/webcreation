import { describe, expect, it } from 'vitest'
import {
  convertFromKwd,
  convertRange,
  estimateRange,
  formatMoney,
  formatRange,
  type CurrencyRate,
  type PriceFactor,
} from '@/lib/pricing/engine'

const KWD: CurrencyRate = { code: 'KWD', symbol: 'KD', ratePerKwd: 1, rounding: 1, decimals: 0 }
const USD: CurrencyRate = { code: 'USD', symbol: '$', ratePerKwd: 3.27, rounding: 5, decimals: 0 }
const BHD: CurrencyRate = { code: 'BHD', symbol: 'BD', ratePerKwd: 1.23, rounding: 1, decimals: 0 }

const factors: PriceFactor[] = [
  { slug: 'extra-page', deltaFromKwd: 20, deltaToKwd: 40, pricingMode: 'per_unit', maxUnits: 10 },
  { slug: 'arabic', deltaFromKwd: 60, deltaToKwd: 120, pricingMode: 'flat' },
  { slug: 'payments', deltaFromKwd: 100, deltaToKwd: 250, pricingMode: 'flat' },
]

describe('estimateRange', () => {
  it('returns the base range with no selections', () => {
    expect(estimateRange({ from: 300, to: 900 }, factors, [])).toEqual({ from: 300, to: 900 })
  })

  it('adds flat factors once', () => {
    expect(estimateRange({ from: 300, to: 900 }, factors, [{ slug: 'arabic' }])).toEqual({
      from: 360,
      to: 1020,
    })
  })

  it('multiplies per-unit factors and clamps to maxUnits', () => {
    expect(
      estimateRange({ from: 0, to: 0 }, factors, [{ slug: 'extra-page', units: 3 }]),
    ).toEqual({ from: 60, to: 120 })
    expect(
      estimateRange({ from: 0, to: 0 }, factors, [{ slug: 'extra-page', units: 50 }]),
    ).toEqual({ from: 200, to: 400 })
  })

  it('ignores unknown slugs, duplicates and negative units', () => {
    expect(
      estimateRange({ from: 100, to: 200 }, factors, [
        { slug: 'nope' },
        { slug: 'arabic' },
        { slug: 'arabic' },
        { slug: 'extra-page', units: -4 },
      ]),
    ).toEqual({ from: 160, to: 320 })
  })

  it('never returns to < from', () => {
    const weird: PriceFactor[] = [
      { slug: 'odd', deltaFromKwd: 100, deltaToKwd: 0, pricingMode: 'flat' },
    ]
    expect(estimateRange({ from: 10, to: 20 }, weird, [{ slug: 'odd' }])).toEqual({
      from: 110,
      to: 110,
    })
  })
})

describe('convertFromKwd', () => {
  it('is the identity for KWD', () => {
    expect(convertFromKwd(300, KWD)).toBe(300)
  })

  it('rounds USD to the nearest 5', () => {
    expect(convertFromKwd(300, USD)).toBe(980) // 981 -> 980
    expect(convertFromKwd(900, USD)).toBe(2945) // 2943 -> 2945
  })

  it('respects decimals', () => {
    expect(convertFromKwd(1, { ...BHD, rounding: 0.01, decimals: 2 })).toBe(1.23)
  })

  it('converts a whole range', () => {
    expect(convertRange({ from: 300, to: 900 }, USD)).toEqual({ from: 980, to: 2945 })
  })
})

describe('formatting', () => {
  it('formats money with the currency symbol', () => {
    expect(formatMoney(980, USD, 'en')).toBe('$980')
    expect(formatMoney(300, KWD, 'en')).toBe('KD 300')
    expect(formatMoney(300, KWD, 'ar')).toBe('300 KD')
  })

  it('formats ranges for English and Arabic', () => {
    expect(formatRange({ from: 300, to: 900 }, KWD, 'en')).toBe('KD 300 \u2013 900')
    expect(formatRange({ from: 300, to: 900 }, KWD, 'ar')).toBe('300 \u2013 900 KD')
    expect(formatRange({ from: 980, to: 2945 }, USD, 'en')).toBe('$980 \u2013 2,945')
  })

  it('collapses equal ranges and uses Latin digits for Arabic', () => {
    expect(formatRange({ from: 500, to: 500 }, KWD, 'en')).toBe('KD 500')
    expect(formatRange({ from: 1250, to: 3000 }, USD, 'ar')).toBe('1,250 \u2013 3,000 $')
  })
})
