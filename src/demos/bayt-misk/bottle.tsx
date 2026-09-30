// Glass bottle silhouette tinted per fragrance family.
export function Bottle({ hue, className = '' }: { hue: string; className?: string }) {
  const id = `g-${hue.replace('#', '')}`
  return (
    <svg viewBox="0 0 200 260" className={className} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={hue} stopOpacity="0.95" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="1" stopColor={hue} />
        </linearGradient>
      </defs>
      <rect x="80" y="10" width="40" height="34" rx="4" fill="#b8863b" />
      <rect x="86" y="44" width="28" height="18" fill="#3a2a1a" />
      <path d="M50 70h100c10 0 16 8 16 18v140c0 12-8 20-20 20H54c-12 0-20-8-20-20V88c0-10 6-18 16-18z" fill={`url(#${id})`} stroke="#ffffff22" />
      <path d="M62 90v120" stroke="#fff" strokeOpacity="0.35" strokeWidth="6" strokeLinecap="round" />
    </svg>
  )
}
