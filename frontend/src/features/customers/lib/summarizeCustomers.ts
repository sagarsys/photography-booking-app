import type { BookingRequestResponse, BookingStatus } from '../../../shared/api/types'

export interface AdminCustomerSummary {
  customerId: number
  fullName: string
  email: string
  phone: string | null
  bookingCount: number
  latestBookingId: number
  latestRequestedDate: string
  latestStatus: BookingStatus
  packageNames: string[]
}

export function summarizeCustomers(bookings: BookingRequestResponse[]) {
  const customerMap = new Map<string, AdminCustomerSummary>()

  for (const booking of bookings) {
    const key = booking.customer.email.trim().toLowerCase()
    const existing = customerMap.get(key)

    if (!existing) {
      customerMap.set(key, {
        customerId: booking.customer.id,
        fullName: booking.customer.fullName,
        email: booking.customer.email,
        phone: booking.customer.phone,
        bookingCount: 1,
        latestBookingId: booking.id,
        latestRequestedDate: booking.requestedDate,
        latestStatus: booking.status,
        packageNames: [booking.photographyPackage.name],
      })
      continue
    }

    existing.bookingCount += 1

    if (new Date(booking.requestedDate) > new Date(existing.latestRequestedDate)) {
      existing.latestBookingId = booking.id
      existing.latestRequestedDate = booking.requestedDate
      existing.latestStatus = booking.status
      existing.fullName = booking.customer.fullName
      existing.phone = booking.customer.phone
    }

    if (!existing.packageNames.includes(booking.photographyPackage.name)) {
      existing.packageNames.push(booking.photographyPackage.name)
      existing.packageNames.sort((left, right) => left.localeCompare(right))
    }
  }

  return [...customerMap.values()].sort((left, right) =>
    left.fullName.localeCompare(right.fullName),
  )
}
