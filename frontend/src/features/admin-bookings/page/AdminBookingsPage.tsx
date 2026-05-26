import { BookingFilters } from '@/features/admin-bookings/components/BookingFilters'
import { BookingTable } from '@/features/admin-bookings/components/BookingTable'
import { useAdminBookings } from '@/features/admin-bookings/hooks/useAdminBookings'
import { Button } from '@/shared/ui/button'
import { Card, CardTitle } from '@/shared/ui/card'
import { EmptyState } from '@/shared/ui/empty-state'
import { InlineNotice } from '@/shared/ui/inline-notice'
import { PageHeader } from '@/shared/ui/page-header'

export function AdminBookingsPage() {
  const {
    changeStatus,
    errorMessage,
    filteredBookings,
    loadBookings,
    loading,
    search,
    setSearch,
    setStatusFilter,
    statusFilter,
    updatingBookingId,
  } = useAdminBookings()

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Manage booking requests"
        description="This view reflects the booking workflow enforced in the Java service. Actions only appear for valid state transitions, so the UI cannot send impossible status changes."
      />

      <Card className="space-y-6">
        <CardTitle
          title="Booking queue"
          description="List, filter, and transition booking requests using the existing Spring endpoints."
          action={
            <Button onClick={() => void loadBookings()} variant="secondary">
              Refresh
            </Button>
          }
        />

        <BookingFilters
          search={search}
          statusFilter={statusFilter}
          onSearchChange={setSearch}
          onStatusFilterChange={setStatusFilter}
        />

        {errorMessage ? <InlineNotice variant="error">{errorMessage}</InlineNotice> : null}

        {loading ? (
          <InlineNotice>Loading bookings...</InlineNotice>
        ) : filteredBookings.length === 0 ? (
          <EmptyState
            title="No matching bookings"
            description="Try a different search or filter. The backend currently returns the full booking list ordered by newest first."
          />
        ) : (
          <BookingTable
            bookings={filteredBookings}
            updatingBookingId={updatingBookingId}
            onChangeStatus={(bookingId, status) => void changeStatus(bookingId, status)}
          />
        )}
      </Card>
    </div>
  )
}
