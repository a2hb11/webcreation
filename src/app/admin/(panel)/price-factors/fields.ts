import { bilingual, type FieldRow } from '@/lib/admin/fields'

export const factorRows: FieldRow[] = [
  bilingual('name', 'Name', 'text', { max: 120 }),
  bilingual('description', 'Why it costs more', 'textarea', { rows: 2, max: 500 }),
  bilingual('example', 'Example', 'textarea', { rows: 2, max: 300 }),
  [
    { kind: 'slug', name: 'slug', label: 'Slug', required: true },
    {
      kind: 'select',
      name: 'pricing_mode',
      label: 'Pricing mode',
      hint: 'percent = the deltas are % of the package price',
      options: [
        { value: 'flat', label: 'Flat (added once)' },
        { value: 'per_unit', label: 'Per unit (× quantity)' },
        { value: 'percent', label: 'Percent of base' },
      ],
    },
    { kind: 'number', name: 'sort_order', label: 'Sort order', min: 0 },
  ],
  [
    { kind: 'number', name: 'delta_from_kwd', label: 'Adds from (KWD or %)', min: 0, step: 0.5, required: true },
    { kind: 'number', name: 'delta_to_kwd', label: 'Adds up to (KWD or %)', min: 0, step: 0.5, required: true },
    { kind: 'number', name: 'max_units', label: 'Max units (per-unit only)', min: 1 },
  ],
  [
    { kind: 'text', name: 'unit_label_en', label: 'Unit label (English)', hint: 'e.g. page', max: 40 },
    { kind: 'text', name: 'unit_label_ar', label: 'Unit label (Arabic)', max: 40, dir: 'rtl' },
  ],
  [
    { kind: 'checkbox', name: 'in_calculator', label: 'Selectable in the price calculator' },
    { kind: 'checkbox', name: 'published', label: 'Published' },
  ],
]
