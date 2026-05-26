import { useEffect, useMemo, useState } from 'react'
import { getBookings, updateBookingStatus } from '@/features/bookings/api/bookingApi'
import { isApiError } from '@/shared/api/http'
import type { BookingRequestResponse, BookingStatus } from '@/shared/api/types'

export function useAdminBookings() {
  const [bookings, setBookings] = useState<BookingRequestResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<'ALL' | BookingStatus>('ALL')
  const [search, setSearch] = useState('')
  const [updatingBookingId, setUpdatingBookingId] = useState<number | null>(null)

  useEffect(() => {
    void loadBookings()
  }, [])

  async function loadBookings() {
    setLoading(true)
    setErrorMessage(null)

    try {
      const response = await getBookings()
      setBookings(response)
    } catch (error) {
      setErrorMessage(
        isApiError(error) ? error.message : 'Unable to load booking requests.',
      )
    } finally {
      setLoading(false)
    }
  }

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase()

    return bookings.filter((booking) => {
      const matchesStatus = statusFilter === 'ALL' || booking.status === statusFilter
      const matchesQuery =
        !query ||
        booking.customer.fullName.toLowerCase().includes(query) ||
        booking.customer.email.toLowerCase().includes(query) ||
        booking.photographyPackage.name.toLowerCase().includes(query)

      return matchesStatus && matchesQuery
    })
  }, [bookings, search, statusFilter])

  async function changeStatus(bookingId: number, nextStatus: BookingStatus) {
    setUpdatingBookingId(bookingId)
    setErrorMessage(null)

    try {
      const updated = await updateBookingStatus(bookingId, nextStatus)
      setBookings((current) =>
        current.map((booking) => (booking.id === bookingId ? updated : booking)),
      )
    } catch (error) {
      setErrorMessage(
        isApiError(error)
          ? error.message
          : 'Unable to update the booking status right now.',
      )
    } finally {
      setUpdatingBookingId(null)
    }
  }

  return {
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
  }
}
