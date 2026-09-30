import type { FieldRow } from '@/lib/admin/fields'

export const currencyRows = (existing: boolean): FieldRow[] => [
  [
    existing
      ? { kind: 'text', name: 'code_display', label: 'Code', readOnly: true }
      : { kind: 'text', name: 'new_code', label: 'Code', hint: 'ISO 4217, e.g. USD', required: true, max: 3 },
    { kind: 'number', name: 'sort_order', label: 'Sort order', min: 0 },
  ],
  [
    { kind: 'text', name: 'name_en', label: 'Name (English)', required: true, max: 60 },
    { kind: 'text', name: 'name_ar', label: 'Name (Arabic)', required: true, max: 60, dir: 'rtl' },
  ],
  [
    { kind: 'text', name: 'symbol', label: 'Symbol (English UI)', hint: 'e.g. $ or KD', required: true, max: 8 },
    { kind: 'text', name: 'symbol_ar', label: 'Symbol (Arabic UI)', hint: 'e.g. د.ك', max: 8, dir: 'rtl' },
  ],
  [
    { kind: 'number', name: 'rate_per_kwd', label: 'Units per 1 KWD', hint: 'e.g. 3.25 for USD', min: 0, step: 0.000001, required: true },
    { kind: 'number', name: 'rounding', label: 'Rounding step', hint: 'converted prices snap to multiples of this', min: 0, step: 0.001, required: true },
    { kind: 'number', name: 'decimals', label: 'Decimals shown', min: 0, max: 3, step: 1 },
  ],
  [
    { kind: 'checkbox', name: 'is_default', label: 'Default currency (prices are stored in it)' },
    { kind: 'checkbox', name: 'enabled', label: 'Enabled in the switcher' },
  ],
]
