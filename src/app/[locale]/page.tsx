import { getTranslations } from 'next-intl/server'

export default async function HomePage() {
  const t = await getTranslations('Home')
  return (
    <main className="mx-auto flex min-h-dvh max-w-5xl flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-sm tracking-[0.3em] text-gold uppercase">{t('eyebrow')}</p>
      <h1 className="font-display text-5xl leading-tight md:text-7xl">{t('headline')}</h1>
      <p className="max-w-xl text-lg text-fg-muted">{t('subline')}</p>
    </main>
  )
}
