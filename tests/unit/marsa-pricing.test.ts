import { describe, expect, it } from 'vitest'
import { addDays, isWeekendNight, nightsBetween, quote, type Chalet } from '@/demos/marsa-chalets/pricing'

const chalet: Chalet = { slug: 'x', weekday: 100, weekend: 150, holiday: 200, minNights: 2, capacity: 10 }

describe('marsa pricing', () => {
  it('counts nights and adds days', () => {
    expect(nightsBetween('2026-10-15', '2026-10-17')).toBe(2)
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01')
  })
  it('treats Thursday and Friday as weekend nights', () => {
    expect(isWeekendNight('2026-10-15')).toBe(true) // Thu
    expect(isWeekendNight('2026-10-16')).toBe(true) // Fri
    expect(isWeekendNight('2026-10-17')).toBe(false) // Sat
  })
  it('prices weekday, weekend and holiday nights with a 30% deposit', () => {
    const q = quote(chalet, '2026-10-14', '2026-10-17') // Wed, Thu, Fri
    expect(q.lines.map((l) => l.kind)).toEqual(['weekday', 'weekend', 'weekend'])
    expect(q.total).toBe(400)
    expect(q.deposit).toBe(120)
    expect(q.balance).toBe(280)
    expect(q.error).toBeUndefined()
  })
  it('flags holidays and minimum nights', () => {
    expect(quote(chalet, '2026-02-25', '2026-02-26').lines[0].kind).toBe('holiday')
    expect(quote(chalet, '2026-10-05', '2026-10-06').error).toBe('min_nights')
    expect(quote(chalet, '2026-10-06', '2026-10-05').error).toBe('invalid')
  })
})
