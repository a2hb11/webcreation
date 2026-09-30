import type { MetadataRoute } from 'next'
import { getProjects } from '@/lib/data/public'
import { locales } from '@/i18n/routing'

const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
const pages = ['', '/work', '/services', '/pricing', '/about', '/contact']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects()
  const entries: MetadataRoute.Sitemap = []
  const paths = [...pages, ...projects.map((p) => `/work/${p.slug}`)]
  for (const path of paths) {
    for (const locale of locales) {
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : 0.7,
        alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${base}/${l}${path}`])) },
      })
    }
  }
  return entries
}
