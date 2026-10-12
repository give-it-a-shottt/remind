import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'neutral' | 'text'
type Size = 'md' | 'sm'

const base = 'inline-flex items-center justify-center gap-1.5 rounded-full font-semibold whitespace-nowrap transition-colors disabled:cursor-not-allowed'
const variants: Record<Variant, string> = {
  primary: 'bg-brand-strong text-white hover:bg-brand-text disabled:bg-brand-300 shadow-sm active:shadow-none',
  secondary: 'border border-brand text-brand-text hover:bg-brand-soft',
  neutral: 'border border-line bg-surface text-ink hover:bg-canvas',
  text: 'text-brand-text hover:underline underline-offset-4',
}
const sizes: Record<Variant, Record<Size, string>> = {
  primary: { md: 'h-12 px-6 text-15', sm: 'h-10 px-5 text-14' },
  secondary: { md: 'h-12 px-6 text-15', sm: 'h-10 px-5 text-14' },
  neutral: { md: 'h-12 px-6 text-15', sm: 'h-10 px-4 text-14' },
  text: { md: 'text-15', sm: 'text-14' },
}

export function buttonClass(variant: Variant = 'primary', size: Size = 'md', full = false) {
  return `${base} ${variants[variant]} ${sizes[variant][size]} ${full ? 'w-full' : ''}`
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  full?: boolean
}

export function Button({ variant = 'primary', size = 'md', full, className = '', ...rest }: Props) {
  return <button type="button" className={`${buttonClass(variant, size, full)} ${className}`} {...rest} />
}

export function LinkButton({ to, variant = 'primary', size = 'md', full, className = '', children }: { to: string; variant?: Variant; size?: Size; full?: boolean; className?: string; children: ReactNode }) {
  return (
    <Link to={to} className={`${buttonClass(variant, size, full)} ${className}`}>
      {children}
    </Link>
  )
}
