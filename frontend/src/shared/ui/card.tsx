import type { HTMLAttributes, PropsWithChildren, ReactNode } from 'react'
import { cn } from '../lib/cn'

export function Card({
  children,
  className,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLElement>>) {
  return (
    <section
      className={cn(
        'rounded-3xl border border-white/10 bg-zinc-950/70 p-6 shadow-xl shadow-black/10',
        className,
      )}
      {...props}
    >
      {children}
    </section>
  )
}

export function CardTitle({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
      <div>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        {description ? <p className="mt-1 text-sm text-zinc-400">{description}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  )
}
