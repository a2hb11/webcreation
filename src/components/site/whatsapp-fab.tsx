import { getTranslations } from 'next-intl/server'
import { getPublicSettings } from '@/lib/data/public'
import { whatsappHref } from '@/lib/site/whatsapp'

export async function WhatsAppFab() {
  const [t, settings] = await Promise.all([getTranslations('Footer'), getPublicSettings()])
  const number = typeof settings.whatsapp_number === 'string' ? settings.whatsapp_number : ''
  if (!number) return null
  return (
    <a
      href={whatsappHref(number, t('whatsappText'))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('whatsapp')}
      className="fixed bottom-5 z-30 inline-flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_40px_-12px_rgb(37_211_102/0.7)] transition-transform duration-(--dur-moderate) ease-(--ease-out-quint) hover:scale-105 end-5"
    >
      <svg viewBox="0 0 32 32" className="size-7" fill="currentColor" aria-hidden>
        <path d="M16 3C8.8 3 3 8.7 3 15.8c0 2.6.8 5.1 2.2 7.2L3.5 29l6.2-1.6c2 1 4.1 1.5 6.3 1.5 7.2 0 13-5.7 13-12.9S23.2 3 16 3zm0 23.6c-2 0-3.9-.5-5.6-1.5l-.4-.2-3.7 1 1-3.5-.3-.4a10.4 10.4 0 0 1-1.7-5.7C5.3 10 10.1 5.3 16 5.3S26.7 10 26.7 15.8 21.9 26.6 16 26.6zm5.9-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.7 8.7 0 0 1-2.6-1.6 9.7 9.7 0 0 1-1.8-2.2c-.2-.3 0-.5.1-.7l.5-.6.3-.5c.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.1 1.1-1.1 2.7 1.2 3.1 1.3 3.4c.2.2 2.3 3.5 5.6 4.9 2.8 1.1 3.3.9 3.9.8s1.9-.8 2.2-1.5.3-1.4.2-1.5-.3-.3-.6-.4z" />
      </svg>
    </a>
  )
}
