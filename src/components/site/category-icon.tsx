import { Building2, CalendarCheck, GalleryHorizontal, LayoutDashboard, Layout, Rocket, ShoppingBag, Utensils, type LucideProps } from 'lucide-react'

const icons: Record<string, React.ComponentType<LucideProps>> = {
  rocket: Rocket,
  'building-2': Building2,
  'gallery-horizontal': GalleryHorizontal,
  'shopping-bag': ShoppingBag,
  utensils: Utensils,
  'calendar-check': CalendarCheck,
  'layout-dashboard': LayoutDashboard,
  layout: Layout,
}

export function CategoryIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = icons[name] ?? Layout
  return <Icon strokeWidth={1.5} aria-hidden {...props} />
}
