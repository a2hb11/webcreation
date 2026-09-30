import { bilingual, LINES_HINT, type FieldRow } from '@/lib/admin/fields'

export const planRows: FieldRow[] = [
  bilingual('name', 'Name', 'text', { max: 120 }),
  [
    { kind: 'slug', name: 'slug', label: 'Slug', required: true },
    { kind: 'number', name: 'price_kwd_month', label: 'Price per month (KWD)', min: 0, step: 0.5, required: true },
    { kind: 'number', name: 'sort_order', label: 'Sort order', min: 0 },
  ],
  [{ kind: 'lines', name: 'includes', label: "What's included", hint: LINES_HINT }],
  [
    { kind: 'checkbox', name: 'highlighted', label: 'Highlighted (recommended plan)' },
    { kind: 'checkbox', name: 'published', label: 'Published' },
  ],
]
