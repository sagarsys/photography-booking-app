import type { PropsWithChildren } from 'react'
import { cn } from '@/shared/lib/cn'

const variantClasses = {
  neutral: 'border-white/10 bg-white/5 text-zinc-300',
  error: 'border-rose-500/30 bg-rose-500/10 text-rose-200',
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-100',
}

export function InlineNotice({
  variant = 'neutral',
  children,
}: PropsWithChildren<{ variant?: keyof typeof variantClasses }>) {
  return (
    <div className={cn('rounded-2xl border px-4 py-3 text-sm', variantClasses[variant])}>
      {children}
    </div>
  )
}
