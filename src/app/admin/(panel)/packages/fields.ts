import { bilingual, LINES_HINT, type FieldRow } from '@/lib/admin/fields'

export const TIER_OPTIONS = [
  { value: 'starter', label: 'Starter' },
  { value: 'professional', label: 'Professional' },
  { value: 'elite', label: 'Elite' },
]

export const packageRows = (categories: { value: string; label: string }[]): FieldRow[] => [
  [
    { kind: 'select', name: 'category_id', label: 'Category', options: [{ value: '', label: 'Generic (fallback for every category)' }, ...categories] },
    { kind: 'select', name: 'tier', label: 'Tier', options: TIER_OPTIONS },
    { kind: 'number', name: 'sort_order', label: 'Sort order', min: 0 },
  ],
  bilingual('name', 'Name', 'text', { max: 120 }),
  bilingual('tagline', 'Tagline', 'text', { max: 160, required: false }),
  [
    { kind: 'number', name: 'price_from_kwd', label: 'Price from (KWD)', min: 0, step: 5, required: true },
    { kind: 'number', name: 'price_to_kwd', label: 'Price up to (KWD)', min: 0, step: 5, required: true },
  ],
  [
    { kind: 'number', name: 'delivery_days_min', label: 'Delivery from (days)', min: 1, required: true },
    { kind: 'number', name: 'delivery_days_max', label: 'Delivery up to (days)', min: 1, required: true },
  ],
  [{ kind: 'lines', name: 'includes', label: "What's included", hint: LINES_HINT }],
  [
    { kind: 'checkbox', name: 'highlighted', label: 'Highlighted ("Most chosen")' },
    { kind: 'checkbox', name: 'published', label: 'Published' },
  ],
]
