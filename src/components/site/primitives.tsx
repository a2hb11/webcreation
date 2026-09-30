import type { ComponentProps, ReactNode } from 'react'
import { Link } from '@/i18n/navigation'

export function Container({ className = '', ...props }: ComponentProps<'div'>) {
  return <div {...props} className={`container-site ${className}`} />
}

type SectionProps = ComponentProps<'section'> & { band?: boolean; tight?: boolean }

export function Section({ className = '', band, tight, ...props }: SectionProps) {
  return (
    <section
      {...props}
      className={`${band ? 'bg-bg-1' : ''} ${tight ? 'py-16 md:py-24' : 'py-20 md:py-32'} ${className}`}
    />
  )
}

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`flex items-center gap-3 text-eyebrow font-semibold text-gold-500 uppercase rtl:tracking-normal rtl:normal-case rtl:text-[13px] ${className}`}>
      <span aria-hidden className="h-px w-6 bg-gold-500" />
      {children}
    </p>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = 'start',
}: {
  eyebrow?: ReactNode
  title: ReactNode
  lead?: ReactNode
  align?: 'start' | 'center'
}) {
  return (
    <div className={`mb-12 max-w-2xl md:mb-16 ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      {eyebrow && <Eyebrow className={align === 'center' ? 'justify-center' : ''}>{eyebrow}</Eyebrow>}
      <h2 className="font-display mt-4 text-h2 font-semibold text-text-1">{title}</h2>
      {lead && <p className="mt-5 text-lg leading-relaxed text-text-2">{lead}</p>}
    </div>
  )
}

type ButtonVariant = 'primary' | 'ghost' | 'link'
const buttonBase =
  'group inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-[background-color,border-color,color,transform,box-shadow] duration-(--dur-fast) ease-(--ease-out-cubic) active:scale-[0.98] disabled:opacity-60'
const buttonStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-btn-primary text-btn-primary-fg hover:bg-btn-primary-hover hover:-translate-y-px hover:shadow-[0_8px_30px_-12px_rgb(212_175_55/0.55)]',
  ghost: 'border border-border-2 text-text-1 hover:border-gold-500/45 hover:text-gold-400',
  link: 'px-0 py-0 text-gold-400 underline-offset-4 hover:text-gold-300 hover:underline',
}

export function buttonClass(variant: ButtonVariant = 'primary', className = '') {
  return `${buttonBase} ${buttonStyles[variant]} ${className}`
}

export function Button({ variant = 'primary', className = '', ...props }: ComponentProps<'button'> & { variant?: ButtonVariant }) {
  return <button {...props} className={buttonClass(variant, className)} />
}

type LinkHref = ComponentProps<typeof Link>['href']

export function ButtonLink({ href, variant = 'primary', className = '', children, ...props }: { href: LinkHref; variant?: ButtonVariant; className?: string; children: ReactNode } & Omit<ComponentProps<typeof Link>, 'href' | 'className' | 'children'>) {
  return (
    <Link href={href} {...props} className={buttonClass(variant, className)}>
      {children}
    </Link>
  )
}

/** Arrow that points forward in the reading direction and nudges on hover. */
export function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      className={`size-4 transition-transform duration-(--dur-fast) ease-(--ease-out-cubic) group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <path d="M4 10h12M11 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Chip({ children, tone = 'neutral', className = '' }: { children: ReactNode; tone?: 'neutral' | 'gold' | 'success'; className?: string }) {
  const styles = {
    neutral: 'border-border-1 bg-surface-2 text-text-2',
    gold: 'border-gold-500/30 bg-gold-500/10 text-gold-300 light:text-gold-700 light:bg-gold-100',
    success: 'border-success/30 bg-success/10 text-success',
  }[tone]
  return <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium tnum ${styles} ${className}`}>{children}</span>
}

export function GoldRule() {
  return <div aria-hidden className="h-px w-full bg-linear-to-r from-transparent via-gold-500/60 to-transparent" />
}
