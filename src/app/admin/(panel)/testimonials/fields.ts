import { bilingual, type FieldRow } from '@/lib/admin/fields'

export const testimonialRows = (projects: { value: string; label: string }[]): FieldRow[] => [
  [
    { kind: 'text', name: 'author_name', label: 'Client name', required: true, max: 120 },
    { kind: 'select', name: 'project_id', label: 'Related project', options: [{ value: '', label: '— none —' }, ...projects] },
    { kind: 'number', name: 'sort_order', label: 'Sort order', min: 0 },
  ],
  bilingual('author_role', 'Role / company', 'text', { max: 120, required: false }),
  bilingual('quote', 'Quote', 'textarea', { rows: 4, max: 1000 }),
  [{ kind: 'checkbox', name: 'published', label: 'Published (only for real clients)' }],
]
