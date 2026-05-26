import type { BookingStatus } from '../../../shared/api/types'

export function getAllowedStatusActions(status: BookingStatus): BookingStatus[] {
  switch (status) {
    case 'PENDING':
      return ['CONFIRMED', 'CANCELLED']
    case 'CONFIRMED':
      return ['COMPLETED', 'CANCELLED']
    case 'CANCELLED':
    case 'COMPLETED':
      return []
  }
}
