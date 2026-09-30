// Small formatting helpers for admin screens (Kuwait time, Latin digits).
const dateTime = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kuwait',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export const fmtDateTime = (iso: string) => dateTime.format(new Date(iso))

export const waLink = (phone: string, text: string) =>
  `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`

export const shortId = (id: string | null) => (id ? id.slice(0, 8) : 'system')
