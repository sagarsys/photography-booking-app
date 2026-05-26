import type { BookingStatus } from '@/shared/api/types'
import { cn } from '@/shared/lib/cn'

const statusClasses: Record<BookingStatus, string> = {
  PENDING: 'bg-amber-500/15 text-amber-200 ring-1 ring-amber-400/20',
  CONFIRMED: 'bg-sky-500/15 text-sky-200 ring-1 ring-sky-400/20',
  CANCELLED: 'bg-rose-500/15 text-rose-200 ring-1 ring-rose-400/20',
  COMPLETED: 'bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/20',
}

export function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-wide',
        statusClasses[status],
      )}
    >
      {status}
    </span>
  )
}
