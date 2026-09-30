'use client'

import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { Link } from '@/i18n/navigation'
import { convertRange, estimateRange, formatRange, type CurrencyRate, type PriceFactor } from '@/lib/pricing/engine'
import { SPRING } from '@/lib/motion'
import { whatsappHref } from '@/lib/site/whatsapp'

export type CalcCategory = { slug: string; name: string }
export type CalcPackage = { categorySlug: string | null; tier: string; name: string; from: number; to: number }
export type CalcFactor = PriceFactor & { name: string; description: string; unitLabel: string | null }

type Labels = Record<'category' | 'tier' | 'extras' | 'estimate' | 'disclaimer' | 'whatsapp' | 'form' | 'units' | 'summary' | 'none', string>

export function Calculator({ categories, packages, factors, currency, locale, whatsapp, tierNames, labels }: { categories: CalcCategory[]; packages: CalcPackage[]; factors: CalcFactor[]; currency: CurrencyRate; locale: string; whatsapp: string; tierNames: Record<string, string>; labels: Labels }) {
  const tiers = ['starter', 'professional', 'elite']
  const [category, setCategory] = useState(categories[0]?.slug ?? '')
  const [tier, setTier] = useState('professional')
  const [selected, setSelected] = useState<Record<string, number>>({})

  const pkg = useMemo(() => packages.find((p) => p.categorySlug === category && p.tier === tier) ?? packages.find((p) => p.categorySlug === null && p.tier === tier), [packages, category, tier])
  const selections = Object.entries(selected).map(([slug, units]) => ({ slug, units }))
  const estimate = pkg ? estimateRange({ from: pkg.from, to: pkg.to }, factors, selections) : null
  const display = estimate ? formatRange(convertRange(estimate, currency), currency, locale) : null
  const chosen = factors.filter((f) => selected[f.slug] !== undefined)
  const categoryName = categories.find((c) => c.slug === category)?.name ?? ''
  const summary = `${labels.summary}\n${categoryName} · ${tierNames[tier]}\n${chosen.map((f) => `+ ${f.name}${f.pricingMode === 'per_unit' ? ` × ${selected[f.slug]}` : ''}`).join('\n') || labels.none}\n${labels.estimate}: ${display ?? '—'}`
  const calculatorJson = JSON.stringify(selections)

  const toggle = (f: CalcFactor) =>
    setSelected((s) => {
      const next = { ...s }
      if (next[f.slug] !== undefined) delete next[f.slug]
      else next[f.slug] = f.pricingMode === 'per_unit' ? 1 : 1
      return next
    })

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="flex flex-col gap-8">
        <fieldset>
          <legend className="mb-3 text-sm font-medium text-text-3">{labels.category}</legend>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button key={c.slug} type="button" onClick={() => setCategory(c.slug)} aria-pressed={category === c.slug} className={`relative rounded-full border px-4 py-2 text-sm transition-colors ${category === c.slug ? 'border-gold-500/50 text-gold-300 light:text-gold-700' : 'border-border-1 bg-surface-1 text-text-2 hover:text-text-1'}`}>
                {category === c.slug && <motion.span layoutId="calc-cat" transition={SPRING.layout} className="absolute inset-0 -z-10 rounded-full bg-gold-500/12" />}
                {c.name}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-3 text-sm font-medium text-text-3">{labels.tier}</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {tiers.map((tr) => {
              const p = packages.find((x) => x.categorySlug === category && x.tier === tr) ?? packages.find((x) => x.categorySlug === null && x.tier === tr)
              return (
                <button key={tr} type="button" onClick={() => setTier(tr)} aria-pressed={tier === tr} className={`rounded-card border p-4 text-start transition-colors ${tier === tr ? 'border-gold-500/50 bg-gold-500/8' : 'border-border-1 bg-surface-1 hover:border-border-2'}`}>
                  <span className="block text-sm font-semibold text-text-1">{tierNames[tr]}</span>
                  {p && <span className="mt-1 block text-xs text-text-3 tnum"><bdi dir="ltr">{formatRange(convertRange({ from: p.from, to: p.to }, currency), currency, locale)}</bdi></span>}
                </button>
              )
            })}
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-3 text-sm font-medium text-text-3">{labels.extras}</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {factors.map((f) => {
              const on = selected[f.slug] !== undefined
              return (
                <div key={f.slug} className={`flex items-start gap-3 rounded-card border p-4 transition-colors ${on ? 'border-gold-500/40 bg-gold-500/6' : 'border-border-1 bg-surface-1'}`}>
                  <button type="button" role="switch" aria-checked={on} onClick={() => toggle(f)} className={`relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors ${on ? 'bg-gold-500' : 'bg-border-2'}`}>
                    <span className={`absolute top-0.5 size-4 rounded-full bg-bg-0 transition-transform duration-(--dur-base) ${on ? 'start-4' : 'start-0.5'}`} />
                  </button>
                  <div className="flex-1">
                    <button type="button" onClick={() => toggle(f)} className="block text-start text-sm font-medium text-text-1">{f.name}</button>
                    <p className="mt-0.5 text-xs text-text-3">{f.description}</p>
                    {on && f.pricingMode === 'per_unit' && (
                      <label className="mt-2 flex items-center gap-2 text-xs text-text-3">
                        {labels.units}
                        <input type="number" min={1} max={f.maxUnits ?? 100} value={selected[f.slug]} onChange={(e) => setSelected((s) => ({ ...s, [f.slug]: Math.max(1, Math.min(f.maxUnits ?? 100, Number(e.target.value) || 1)) }))} className="w-16 rounded-md border border-border-1 bg-surface-2 px-2 py-1 text-text-1 tnum" />
                        {f.unitLabel}
                      </label>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </fieldset>
      </div>
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-card border border-gold-500/40 bg-surface-1 p-7 shadow-[0_30px_80px_-40px_rgb(212_175_55/0.35)]">
          <p className="text-sm text-text-3">{labels.estimate}</p>
          <motion.p key={display} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="font-display mt-2 text-4xl text-text-1 tnum">
            <bdi dir="ltr">{display ?? '—'}</bdi>
          </motion.p>
          <p className="mt-3 text-sm text-text-2">{categoryName} · {tierNames[tier]}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {chosen.map((f) => (
              <motion.li key={f.slug} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-border-1 bg-surface-2 px-2.5 py-1 text-xs text-text-2">
                + {f.name}{f.pricingMode === 'per_unit' ? ` × ${selected[f.slug]}` : ''}
              </motion.li>
            ))}
          </ul>
          <p className="mt-5 text-xs leading-relaxed text-text-3">{labels.disclaimer}</p>
          <div className="mt-6 flex flex-col gap-2">
            {whatsapp && (
              <a href={whatsappHref(whatsapp, summary)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-xl bg-btn-primary px-5 py-3 text-sm font-medium text-btn-primary-fg transition hover:bg-btn-primary-hover">
                {labels.whatsapp}
              </a>
            )}
            <Link href={{ pathname: '/contact', query: { cat: category, tier, calc: calculatorJson } }} className="inline-flex items-center justify-center rounded-xl border border-border-2 px-5 py-3 text-sm font-medium text-text-1 transition hover:border-gold-500/45 hover:text-gold-400">
              {labels.form}
            </Link>
          </div>
        </div>
      </aside>
    </div>
  )
}
