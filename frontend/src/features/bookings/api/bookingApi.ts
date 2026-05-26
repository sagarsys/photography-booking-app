import { request } from '@/shared/api/http'
import type {
  BookingRequestCreateRequest,
  BookingRequestResponse,
  BookingStatus,
} from '@/shared/api/types'

export function getBookings() {
  return request<BookingRequestResponse[]>('/api/booking-requests')
}

export function createBooking(payload: BookingRequestCreateRequest) {
  return request<BookingRequestResponse>('/api/booking-requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateBookingStatus(id: number, status: BookingStatus) {
  return request<BookingRequestResponse>(`/api/booking-requests/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}
