import { L, getDemoLocale } from '@/components/demo/shell'
import { MenuClient } from '@/demos/sahwa-roasters/menu-client'

export default async function SahwaMenu() {
  const l = await getDemoLocale()
  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-8">
      <h1 className="font-demo-display py-6 text-4xl font-semibold">{L(l, 'Menu', 'القائمة')}</h1>
      <MenuClient locale={l} />
    </div>
  )
}
