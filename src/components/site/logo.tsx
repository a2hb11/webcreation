// Wordmark: Noxaur in the display serif with a gold diamond. Not mirrored in RTL.
export function Logo({ className = '' }: { className?: string }) {
  return (
    <span dir="ltr" className={`font-display inline-flex items-center gap-2 text-2xl font-semibold tracking-tight text-text-1 ${className}`} style={{ fontFamily: 'var(--font-display-latin)' }}>
      <svg aria-hidden viewBox="0 0 12 12" className="size-2.5 text-gold-500">
        <path d="M6 0l6 6-6 6-6-6z" fill="currentColor" />
      </svg>
      Noxaur
    </span>
  )
}
