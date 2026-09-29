import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export default async function NotFound() {
  const t = await getTranslations('NotFound')
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm tracking-[0.3em] text-gold uppercase">404</p>
      <h1 className="font-display text-4xl">{t('title')}</h1>
      <p className="text-fg-muted">{t('body')}</p>
      <Link href="/" className="mt-4 text-gold underline-offset-4 hover:underline">
        {t('backHome')}
      </Link>
    </main>
  )
}
