// Serializable field descriptors consumed by <EntityForm>. Kept free of any
// server-only import so Client Components can receive them as props.
export type FieldDef =
  | {
      kind: 'text' | 'slug' | 'email' | 'url' | 'color'
      name: string
      label: string
      hint?: string
      required?: boolean
      max?: number
      dir?: 'rtl' | 'ltr'
      readOnly?: boolean
    }
  | { kind: 'textarea'; name: string; label: string; hint?: string; rows?: number; max?: number; dir?: 'rtl' | 'ltr' }
  | { kind: 'number'; name: string; label: string; hint?: string; min?: number; max?: number; step?: number; required?: boolean }
  | { kind: 'checkbox'; name: string; label: string }
  | { kind: 'select'; name: string; label: string; hint?: string; options: { value: string; label: string }[] }
  | { kind: 'lines'; name: string; label: string; hint?: string; rows?: number }

/** A row of fields rendered side by side (1–3 columns). */
export type FieldRow = FieldDef[]

export const bilingual = (base: string, label: string, kind: 'text' | 'textarea' = 'text', extra: Partial<{ max: number; rows: number; required: boolean }> = {}): FieldRow =>
  kind === 'text'
    ? [
        { kind, name: `${base}_en`, label: `${label} (English)`, required: extra.required ?? true, max: extra.max },
        { kind, name: `${base}_ar`, label: `${label} (Arabic)`, required: extra.required ?? true, max: extra.max, dir: 'rtl' },
      ]
    : [
        { kind, name: `${base}_en`, label: `${label} (English)`, rows: extra.rows, max: extra.max },
        { kind, name: `${base}_ar`, label: `${label} (Arabic)`, rows: extra.rows, max: extra.max, dir: 'rtl' },
      ]

export const LINES_HINT = 'One item per line as "English | العربية"'
