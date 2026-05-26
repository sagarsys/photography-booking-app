import { useEffect, useMemo, useState } from 'react'
import { createBooking } from '@/features/bookings/api/bookingApi'
import { getPackages } from '@/features/packages/api/packageApi'
import {
  getBookingFieldKey,
  initialBookingFormValues,
  toBookingRequest,
  validateBookingForm,
  type BookingFormValues,
} from '@/features/public-booking/lib/bookingForm'
import { isApiError } from '@/shared/api/http'
import type {
  BookingRequestResponse,
  PhotographyPackageResponse,
} from '@/shared/api/types'

export function usePublicBooking() {
  const [packages, setPackages] = useState<PhotographyPackageResponse[]>([])
  const [packagesLoading, setPackagesLoading] = useState(true)
  const [packagesError, setPackagesError] = useState<string | null>(null)
  const [selectedPackageId, setSelectedPackageId] = useState('')
  const [form, setForm] = useState<BookingFormValues>(initialBookingFormValues)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [createdBooking, setCreatedBooking] = useState<BookingRequestResponse | null>(null)

  useEffect(() => {
    void loadPackages()
  }, [])

  async function loadPackages() {
    setPackagesLoading(true)
    setPackagesError(null)

    try {
      const response = await getPackages()
      setPackages(response)
      setSelectedPackageId((current) => {
        if (current && response.some((item) => String(item.id) === current)) {
          return current
        }

        return response[0] ? String(response[0].id) : ''
      })
    } catch (error) {
      setPackagesError(
        isApiError(error)
          ? error.message
          : 'Unable to load photography packages right now.',
      )
    } finally {
      setPackagesLoading(false)
    }
  }

  const selectedPackage = useMemo(
    () => packages.find((item) => String(item.id) === selectedPackageId) ?? null,
    [packages, selectedPackageId],
  )

  function setFormValue(key: keyof BookingFormValues, value: string) {
    setForm((current) => ({ ...current, [key]: value }))
    setFieldErrors((current) => {
      const next = { ...current }
      delete next[getBookingFieldKey(key)]
      return next
    })
  }

  async function submitBooking() {
    const nextErrors = validateBookingForm(form, selectedPackageId)
    setFieldErrors(nextErrors)
    setSubmitMessage(null)

    if (Object.keys(nextErrors).length > 0) {
      return false
    }

    setSubmitting(true)

    try {
      const response = await createBooking(toBookingRequest(form, selectedPackageId))
      setCreatedBooking(response)
      setForm(initialBookingFormValues)
      setFieldErrors({})
      setSubmitMessage('Booking request submitted successfully.')
      return true
    } catch (error) {
      if (isApiError(error)) {
        setFieldErrors(error.body?.fieldErrors ?? {})
        setSubmitMessage(error.message)
      } else {
        setSubmitMessage('Something went wrong while sending the booking request.')
      }
      return false
    } finally {
      setSubmitting(false)
    }
  }

  return {
    createdBooking,
    fieldErrors,
    form,
    loadPackages,
    packages,
    packagesError,
    packagesLoading,
    selectedPackage,
    selectedPackageId,
    setFormValue,
    setSelectedPackageId,
    submitBooking,
    submitMessage,
    submitting,
  }
}
