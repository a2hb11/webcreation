// Live "open now" indicator for Sat–Thu, 16:00–23:00 Asia/Kuwait, computed on
// the server for each request (pages are dynamic anyway).
export function isOpenNow(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kuwait', weekday: 'short', hour: 'numeric', hour12: false }).formatToParts(now)
  const weekday = parts.find((p) => p.type === 'weekday')?.value ?? ''
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? '0') % 24
  return weekday !== 'Fri' && hour >= 16 && hour < 23
}

export function HoursBadge({ openLabel, closedLabel }: { openLabel: string; closedLabel: string }) {
  const open = isOpenNow()
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs ${open ? 'border-success/30 text-success' : 'border-border-2 text-text-3'}`}>
      <span aria-hidden className={`size-1.5 rounded-full ${open ? 'animate-pulse bg-success' : 'bg-text-4'}`} />
      {open ? openLabel : closedLabel}
    </span>
  )
}
