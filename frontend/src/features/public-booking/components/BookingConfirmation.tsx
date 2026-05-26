import type { BookingRequestResponse } from '@/shared/api/types'
import { formatDateTime } from '@/shared/lib/format'
import { Card, CardTitle } from '@/shared/ui/card'
import { StatusBadge } from '@/shared/ui/status-badge'

export function BookingConfirmation({
  booking,
}: {
  booking: BookingRequestResponse
}) {
  return (
    <Card>
      <CardTitle
        title="Latest submitted booking"
        description="The Java service sets new bookings to PENDING automatically, so the confirmation reflects the server response rather than a client-side assumption."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-white/[0.04] p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Booking id</p>
          <p className="mt-2 text-lg font-semibold text-white">#{booking.id}</p>
        </div>
        <div className="rounded-2xl bg-white/[0.04] p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Status</p>
          <div className="mt-2">
            <StatusBadge status={booking.status} />
          </div>
        </div>
        <div className="rounded-2xl bg-white/[0.04] p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Package</p>
          <p className="mt-2 text-lg font-semibold text-white">
            {booking.photographyPackage.name}
          </p>
        </div>
        <div className="rounded-2xl bg-white/[0.04] p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Requested date</p>
          <p className="mt-2 text-lg font-semibold text-white">
            {formatDateTime(booking.requestedDate)}
          </p>
        </div>
      </div>
    </Card>
  )
}
