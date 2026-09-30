import { Link } from '@/i18n/navigation'
import { L, getDemoLocale, kwd } from '@/components/demo/shell'
import { chalets } from '@/demos/marsa-chalets/data'

export default async function MarsaHome() {
  const l = await getDemoLocale()
  return (
    <div className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
      <section className="relative overflow-hidden rounded-demo bg-[linear-gradient(180deg,#f7d9a8_0%,#f2a24b_45%,#0f7c8c_100%)] p-8 pb-28 text-white sm:p-14 sm:pb-32">
        <svg className="pointer-events-none absolute inset-x-0 bottom-0 w-full" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden>
          <path d="M0 60c150 40 300-40 450 0s300 40 450 0 300-40 300 0v60H0z" fill="#f4f7f8" />
        </svg>
        <p className="text-sm uppercase tracking-[0.2em] rtl:tracking-normal">{L(l, 'Khiran, Kuwait', 'الخيران، الكويت')}</p>
        <h1 className="font-demo-display mt-3 max-w-2xl text-5xl font-semibold leading-tight sm:text-6xl">{L(l, 'Weekends by the water.', 'عطلة نهاية الأسبوع على البحر.')}</h1>
        <p className="mt-4 max-w-md text-white/90">{L(l, 'Three private chalets with pools and direct beach access. See availability and the full price before you message us.', 'ثلاثة شاليهات خاصة بمسابح ووصول مباشر للشاطئ. شاهد التوفر والسعر الكامل قبل أن تراسلنا.')}</p>
        <Link href="/demo/marsa-chalets/book" className="mt-8 inline-block rounded-demo bg-white px-6 py-3 text-sm font-semibold text-demo-accent">{L(l, 'Check availability', 'تحقق من التوفر')}</Link>
      </section>
      <section className="py-14">
        <h2 className="font-demo-display text-3xl font-semibold">{L(l, 'The chalets', 'الشاليهات')}</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {chalets.map((c) => (
            <Link key={c.slug} href={`/demo/marsa-chalets/chalets/${c.slug}`} className="group overflow-hidden rounded-demo border border-demo-line bg-demo-surface transition hover:-translate-y-0.5 hover:shadow-lg">
              <svg viewBox="0 0 400 220" className="w-full" aria-hidden>
                <rect width="400" height="220" fill="#dff1f4" />
                <path d="M0 170h400v50H0z" fill="#0f7c8c" opacity="0.5" />
                <path d="M110 150l90-70 90 70z" fill="#f2a24b" /><rect x="120" y="150" width="160" height="50" fill="#fff" /><rect x="180" y="165" width="40" height="35" fill="#0f7c8c" />
              </svg>
              <div className="p-5">
                <h3 className="font-demo-display text-xl font-semibold">{c[l]}</h3>
                <p className="text-sm text-demo-muted">{l === 'ar' ? c.tag_ar : c.tag_en}</p>
                <p className="mt-3 text-sm"><span className="text-demo-muted">{L(l, 'from', 'من')}</span> <span className="font-semibold tnum" dir="ltr">{kwd(c.weekday, l)}</span> <span className="text-demo-muted">{L(l, '/ night', '/ ليلة')}</span></p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="rounded-demo border border-demo-line bg-demo-surface p-6 text-sm text-demo-muted">
        <h2 className="font-demo-display text-xl font-semibold text-demo-fg">{L(l, 'House rules', 'قواعد المكان')}</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {[['Check-in 3 pm · check-out 12 pm', 'الوصول 3 مساءً · المغادرة 12 ظهرًا'], ['30% deposit via KNET, balance on arrival', 'عربون 30٪ عبر كي-نت والباقي عند الوصول'], ['Families only', 'للعائلات فقط'], ['Free cancellation up to 7 days before', 'إلغاء مجاني حتى 7 أيام قبل الموعد']].map(([en, ar]) => <li key={en}>· {L(l, en, ar)}</li>)}
        </ul>
      </section>
    </div>
  )
}
