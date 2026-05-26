import type { PropsWithChildren } from 'react'

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: PropsWithChildren<{
  label: string
  htmlFor?: string
  hint?: string
  error?: string
}>) {
  return (
    <label className="grid gap-2" htmlFor={htmlFor}>
      <span className="text-sm font-medium text-zinc-200">{label}</span>
      {children}
      {hint ? <span className="text-xs text-zinc-500">{hint}</span> : null}
      {error ? <span className="text-xs text-rose-300">{error}</span> : null}
    </label>
  )
}
