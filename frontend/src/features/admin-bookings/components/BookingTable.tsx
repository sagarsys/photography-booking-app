import { getAllowedStatusActions } from '@/features/bookings/lib/bookingStatus'
import type { BookingRequestResponse, BookingStatus } from '@/shared/api/types'
import { formatDateTime } from '@/shared/lib/format'
import { Button } from '@/shared/ui/button'
import { StatusBadge } from '@/shared/ui/status-badge'

interface BookingTableProps {
  bookings: BookingRequestResponse[]
  updatingBookingId: number | null
  onChangeStatus: (bookingId: number, status: BookingStatus) => void
}

export function BookingTable({
  bookings,
  updatingBookingId,
  onChangeStatus,
}: BookingTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm">
          <thead className="bg-white/[0.03] text-zinc-400">
            <tr>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Package</th>
              <th className="px-4 py-3 font-medium">Requested date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 bg-zinc-950/30">
            {bookings.map((booking) => {
              const nextActions = getAllowedStatusActions(booking.status)
              const isUpdating = updatingBookingId === booking.id

              return (
                <tr key={booking.id} className="align-top">
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <p className="font-medium text-white">{booking.customer.fullName}</p>
                      <p className="text-zinc-400">{booking.customer.email}</p>
                      <p className="text-xs text-zinc-500">
                        {booking.customer.phone || 'No phone'}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <p className="font-medium text-white">
                        {booking.photographyPackage.name}
                      </p>
                      <p className="text-xs text-zinc-500">Booking #{booking.id}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-zinc-300">
                    {formatDateTime(booking.requestedDate)}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      {nextActions.length === 0 ? (
                        <span className="text-xs text-zinc-500">Terminal state</span>
                      ) : (
                        nextActions.map((status) => (
                          <Button
                            key={status}
                            className="px-3 py-1.5 text-xs"
                            disabled={isUpdating}
                            onClick={() => onChangeStatus(booking.id, status)}
                            type="button"
                            variant={status === 'CANCELLED' ? 'danger' : 'secondary'}
                          >
                            {isUpdating ? 'Updating...' : status}
                          </Button>
                        ))
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
