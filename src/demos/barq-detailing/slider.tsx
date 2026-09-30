'use client'

import { useState } from 'react'

// Before/after gloss comparison over a generic car silhouette. Pure SVG + CSS.
export function GlossSlider({ before, after }: { before: string; after: string }) {
  const [pos, setPos] = useState(55)
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-demo border border-demo-line bg-demo-surface select-none">
      <Car className="absolute inset-0 h-full w-full [--paint:#3b4149]" />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <Car className="absolute inset-0 h-full w-full [--paint:url(#gloss)]" glossy />
      </div>
      <div className="pointer-events-none absolute inset-y-0 w-px bg-demo-accent shadow-[0_0_24px_rgb(34_211_238/0.8)]" style={{ left: `${pos}%` }} />
      <span className="pointer-events-none absolute top-3 start-3 rounded-demo bg-demo-bg/70 px-2 py-1 text-xs text-demo-fg">{after}</span>
      <span className="pointer-events-none absolute top-3 end-3 rounded-demo bg-demo-bg/70 px-2 py-1 text-xs text-demo-muted">{before}</span>
      <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} aria-label={`${before} / ${after}`} className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0" dir="ltr" />
    </div>
  )
}

function Car({ className, glossy = false }: { className: string; glossy?: boolean }) {
  return (
    <svg viewBox="0 0 640 360" className={className} aria-hidden>
      <defs>
        <linearGradient id="gloss" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#0b0d10" />
          <stop offset="0.45" stopColor="#3f4652" />
          <stop offset="0.5" stopColor="#c9d3e0" />
          <stop offset="0.55" stopColor="#1b1f26" />
          <stop offset="1" stopColor="#05070a" />
        </linearGradient>
      </defs>
      <ellipse cx="320" cy="300" rx="260" ry="14" fill="#000" opacity="0.5" />
      <path d="M90 250c0-30 20-60 60-70l70-50c30-20 60-30 110-30h60c40 0 70 10 100 40l40 40c20 5 40 25 40 50v30c0 12-8 20-20 20H110c-12 0-20-8-20-20z" fill="var(--paint)" />
      <path d="M230 135c25-16 55-25 100-25h60c30 0 55 8 80 30l25 25H200z" fill={glossy ? '#8fb6c7' : '#2a3038'} opacity="0.9" />
      {glossy && <path d="M120 200h400" stroke="#fff" strokeOpacity="0.35" strokeWidth="3" />}
      <circle cx="190" cy="270" r="40" fill="#0b0d10" stroke="#3a3f47" strokeWidth="6" />
      <circle cx="470" cy="270" r="40" fill="#0b0d10" stroke="#3a3f47" strokeWidth="6" />
      <circle cx="190" cy="270" r="16" fill={glossy ? '#d7dde6' : '#6b7280'} />
      <circle cx="470" cy="270" r="16" fill={glossy ? '#d7dde6' : '#6b7280'} />
    </svg>
  )
}
