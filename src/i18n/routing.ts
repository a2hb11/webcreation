import { defineRouting } from 'next-intl/routing'

export const locales = ['en', 'ar'] as const
export type Locale = (typeof locales)[number]

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  // Always prefix so /en/... and /ar/... are both canonical and cacheable.
  localePrefix: 'always',
  localeCookie: {
    name: 'locale',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  },
})

export function isRtl(locale: string) {
  return locale === 'ar'
}
