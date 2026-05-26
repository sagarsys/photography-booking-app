import { useEffect, useMemo, useState } from 'react'
import { getBookings } from '@/features/bookings/api/bookingApi'
import { summarizeCustomers } from '@/features/customers/lib/summarizeCustomers'
import { isApiError } from '@/shared/api/http'
import type { BookingRequestResponse } from '@/shared/api/types'

export function useAdminCustomers() {
  const [bookings, setBookings] = useState<BookingRequestResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    void loadCustomers()
  }, [])

  async function loadCustomers() {
    setLoading(true)
    setErrorMessage(null)

    try {
      const response = await getBookings()
      setBookings(response)
    } catch (error) {
      setErrorMessage(
        isApiError(error)
          ? error.message
          : 'Unable to load customers from booking data.',
      )
    } finally {
      setLoading(false)
    }
  }

  const customers = useMemo(() => summarizeCustomers(bookings), [bookings])

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase()

    return customers.filter((customer) => {
      if (!query) {
        return true
      }

      return (
        customer.fullName.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        (customer.phone ?? '').toLowerCase().includes(query)
      )
    })
  }, [customers, search])

  return {
    errorMessage,
    filteredCustomers,
    loadCustomers,
    loading,
    search,
    setSearch,
  }
}
