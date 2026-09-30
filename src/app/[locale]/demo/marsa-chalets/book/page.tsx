import { L, getDemoLocale } from '@/components/demo/shell'
import { BookClient } from '@/demos/marsa-chalets/book-client'

export default async function BookPage({ searchParams }: { searchParams: Promise<{ chalet?: string }> }) {
  const [{ chalet }, l] = await Promise.all([searchParams, getDemoLocale()])
  return (
    <div className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
      <h1 className="font-demo-display py-6 text-4xl font-semibold">{L(l, 'Book your stay', 'احجز إقامتك')}</h1>
      <BookClient locale={l} initial={chalet} />
    </div>
  )
}
