import { bilingual, type FieldRow } from '@/lib/admin/fields'

export const faqRows: FieldRow[] = [
  bilingual('question', 'Question', 'text', { max: 300 }),
  bilingual('answer', 'Answer', 'textarea', { rows: 4, max: 2000 }),
  [
    { kind: 'number', name: 'sort_order', label: 'Sort order', min: 0 },
    { kind: 'checkbox', name: 'published', label: 'Published' },
  ],
]
