// Pure pricing engine for the chalet demo: weekday / weekend / holiday
// nightly rates, minimum nights, deposit. Dates are ISO strings (YYYY-MM-DD)
// interpreted in Asia/Kuwait; the weekend is Thursday and Friday nights.

export type Chalet = { slug: string; weekday: number; weekend: number; holiday: number; minNights: number; capacity: number }

export const HOLIDAYS = new Set(['2026-02-25', '2026-02-26', '2026-03-20', '2026-03-21', '2026-03-22', '2026-05-27', '2026-05-28', '2026-05-29'])
export const DEPOSIT_RATE = 0.3

export const nightsBetween = (from: string, to: string) => {
  const a = Date.UTC(+from.slice(0, 4), +from.slice(5, 7) - 1, +from.slice(8, 10))
  const b = Date.UTC(+to.slice(0, 4), +to.slice(5, 7) - 1, +to.slice(8, 10))
  return Math.round((b - a) / 86_400_000)
}

export const addDays = (iso: string, n: number) => {
  const d = new Date(Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10) + n))
  return d.toISOString().slice(0, 10)
}

export const isWeekendNight = (iso: string) => {
  const day = new Date(`${iso}T00:00:00Z`).getUTCDay() // 0 Sun … 6 Sat
  return day === 4 || day === 5
}

export type Quote = { nights: number; lines: { date: string; kind: 'weekday' | 'weekend' | 'holiday'; price: number }[]; total: number; deposit: number; balance: number; error?: 'min_nights' | 'invalid' }

export function quote(chalet: Chalet, from: string, to: string): Quote {
  const nights = nightsBetween(from, to)
  if (!Number.isFinite(nights) || nights <= 0) return { nights: 0, lines: [], total: 0, deposit: 0, balance: 0, error: 'invalid' }
  const lines: Quote['lines'] = []
  for (let i = 0; i < nights; i++) {
    const date = addDays(from, i)
    const kind = HOLIDAYS.has(date) ? 'holiday' : isWeekendNight(date) ? 'weekend' : 'weekday'
    lines.push({ date, kind, price: chalet[kind] })
  }
  const total = lines.reduce((s, l) => s + l.price, 0)
  const deposit = Math.round(total * DEPOSIT_RATE)
  return { nights, lines, total, deposit, balance: total - deposit, error: nights < chalet.minNights ? 'min_nights' : undefined }
}
