import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../lib/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-fuchsia-500 text-white hover:bg-fuchsia-400 disabled:bg-fuchsia-500/50',
  secondary:
    'bg-white/10 text-white hover:bg-white/15 disabled:bg-white/5 disabled:text-zinc-500',
  ghost: 'bg-transparent text-zinc-200 hover:bg-white/10 disabled:text-zinc-500',
  danger: 'bg-rose-500 text-white hover:bg-rose-400 disabled:bg-rose-500/50',
}

export function Button({
  className,
  variant = 'primary',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-fuchsia-400/60 disabled:cursor-not-allowed',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  )
}
