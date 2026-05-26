import type { BookingRequestCreateRequest } from '@/shared/api/types'

export interface BookingFormValues {
  fullName: string
  email: string
  phone: string
  requestedDate: string
  message: string
}

export const initialBookingFormValues: BookingFormValues = {
  fullName: '',
  email: '',
  phone: '',
  requestedDate: '',
  message: '',
}

export function getBookingFieldKey(key: keyof BookingFormValues) {
  return key === 'fullName' || key === 'email' || key === 'phone'
    ? `customer.${key}`
    : key
}

export function validateBookingForm(
  form: BookingFormValues,
  selectedPackageId: string,
) {
  const nextErrors: Record<string, string> = {}

  if (!selectedPackageId) {
    nextErrors.photographyPackageId = 'Photography package is required'
  }

  if (!form.fullName.trim()) {
    nextErrors['customer.fullName'] = 'Customer full name is required'
  } else if (form.fullName.trim().length > 255) {
    nextErrors['customer.fullName'] = 'Customer full name must be at most 255 characters'
  }

  if (!form.email.trim()) {
    nextErrors['customer.email'] = 'Customer email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    nextErrors['customer.email'] = 'Customer email must be valid'
  } else if (form.email.trim().length > 255) {
    nextErrors['customer.email'] = 'Customer email must be at most 255 characters'
  }

  if (form.phone.trim().length > 50) {
    nextErrors['customer.phone'] = 'Customer phone must be at most 50 characters'
  }

  if (!form.requestedDate.trim()) {
    nextErrors.requestedDate = 'Booking requested date is required'
  } else if (Number.isNaN(new Date(form.requestedDate).getTime())) {
    nextErrors.requestedDate = 'Booking requested date must be valid'
  } else if (new Date(form.requestedDate).getTime() <= Date.now()) {
    nextErrors.requestedDate = 'Booking requested date must be in the future'
  }

  if (form.message.trim().length > 5000) {
    nextErrors.message = 'Message must be at most 5000 characters'
  }

  return nextErrors
}

export function toBookingRequest(
  form: BookingFormValues,
  selectedPackageId: string,
): BookingRequestCreateRequest {
  return {
    customer: {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
    },
    photographyPackageId: Number(selectedPackageId),
    requestedDate: new Date(form.requestedDate).toISOString(),
    message: form.message.trim() || null,
  }
}
