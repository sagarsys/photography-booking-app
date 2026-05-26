import type { FormEvent } from 'react'
import { BookingConfirmation } from '@/features/public-booking/components/BookingConfirmation'
import { BookingRequestForm } from '@/features/public-booking/components/BookingRequestForm'
import { PackageCatalog } from '@/features/public-booking/components/PackageCatalog'
import { usePublicBooking } from '@/features/public-booking/hooks/usePublicBooking'
import { Card, CardTitle } from '@/shared/ui/card'
import { PageHeader } from '@/shared/ui/page-header'

export function PublicBookingPage() {
  const {
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
  } = usePublicBooking()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void submitBooking()
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Customer Booking"
        title="Make a photography booking in one flow"
        description="This demo stays aligned with the Java backend: package availability comes from active packages, bookings are created as pending requests, and validation errors map directly from the Spring error response."
      />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="space-y-6">
          <CardTitle
            title="Available packages"
            description="The Java package service only returns active packages, so these are the choices a customer can actually book."
          />

          <PackageCatalog
            packages={packages}
            packagesError={packagesError}
            packagesLoading={packagesLoading}
            selectedPackageId={selectedPackageId}
            onRetry={() => void loadPackages()}
            onSelectPackage={setSelectedPackageId}
          />
        </Card>

        <Card className="space-y-6" id="booking-form">
          <CardTitle
            title="Booking request"
            description="The backend expects a nested customer object, a package id, and a future requested date."
          />

          <BookingRequestForm
            fieldErrors={fieldErrors}
            form={form}
            packages={packages}
            selectedPackage={selectedPackage}
            selectedPackageId={selectedPackageId}
            submitMessage={submitMessage}
            submitting={submitting}
            wasSuccessful={Boolean(createdBooking)}
            onChangeField={setFormValue}
            onSelectPackage={setSelectedPackageId}
            onSubmit={handleSubmit}
          />
        </Card>
      </div>

      {createdBooking ? <BookingConfirmation booking={createdBooking} /> : null}
    </div>
  )
}
