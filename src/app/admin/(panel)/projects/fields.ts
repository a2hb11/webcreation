import { bilingual, LINES_HINT, type FieldRow } from '@/lib/admin/fields'
import { TIER_OPTIONS } from '../packages/fields'

export const projectRows = (categories: { value: string; label: string }[]): FieldRow[] => [
  bilingual('title', 'Title', 'text', { max: 140 }),
  [
    { kind: 'slug', name: 'slug', label: 'Slug', hint: 'URL: /work/<slug>', required: true },
    { kind: 'select', name: 'category_id', label: 'Category', options: categories },
    { kind: 'select', name: 'tier', label: 'Tier', options: TIER_OPTIONS },
  ],
  bilingual('summary', 'Summary (one sentence)', 'textarea', { rows: 2, max: 300 }),
  bilingual('body', 'Case study (problem → solution → result)', 'textarea', { rows: 6, max: 5000 }),
  [
    { kind: 'number', name: 'price_from_kwd', label: 'Example price from (KWD)', min: 0, step: 5, required: true },
    { kind: 'number', name: 'price_to_kwd', label: 'Example price up to (KWD)', min: 0, step: 5, required: true },
    { kind: 'number', name: 'duration_days', label: 'Delivery (days)', min: 1, step: 1 },
  ],
  [{ kind: 'lines', name: 'features', label: 'Features', hint: LINES_HINT }],
  [
    { kind: 'text', name: 'tech_stack', label: 'Tech stack', hint: 'Comma-separated, e.g. Next.js, Supabase, KNET', max: 300 },
    { kind: 'text', name: 'client_name', label: 'Client name', hint: 'Real projects only', max: 120 },
  ],
  [
    { kind: 'url', name: 'live_url', label: 'Live URL', hint: 'https://… for real client sites', dir: 'ltr' },
    { kind: 'text', name: 'demo_route', label: 'Demo route', hint: '/demo/<slug> for concept demos', dir: 'ltr' },
    { kind: 'text', name: 'accent_color', label: 'Accent colour', hint: '#RRGGBB used on the card', max: 7, dir: 'ltr' },
  ],
  [
    { kind: 'checkbox', name: 'is_concept', label: 'Concept project (shows the "Concept" badge)' },
    { kind: 'checkbox', name: 'featured', label: 'Featured on the home page' },
    { kind: 'checkbox', name: 'published', label: 'Published' },
  ],
  [{ kind: 'number', name: 'sort_order', label: 'Sort order', min: 0 }],
]
