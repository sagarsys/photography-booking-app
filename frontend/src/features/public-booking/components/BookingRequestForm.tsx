import type { FormEvent } from 'react'
import type { BookingFormValues } from '../lib/bookingForm'
import type { PhotographyPackageResponse } from '../../../shared/api/types'
import { formatCurrencyFromCents } from '../../../shared/lib/format'
import { Button } from '../../../shared/ui/button'
import { Field } from '../../../shared/ui/field'
import { Input, Select, Textarea } from '../../../shared/ui/form-controls'
import { InlineNotice } from '../../../shared/ui/inline-notice'

interface BookingRequestFormProps {
  fieldErrors: Record<string, string>
  form: BookingFormValues
  packages: PhotographyPackageResponse[]
  selectedPackage: PhotographyPackageResponse | null
  selectedPackageId: string
  submitMessage: string | null
  submitting: boolean
  wasSuccessful: boolean
  onChangeField: (key: keyof BookingFormValues, value: string) => void
  onSelectPackage: (packageId: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function BookingRequestForm({
  fieldErrors,
  form,
  packages,
  selectedPackage,
  selectedPackageId,
  submitMessage,
  submitting,
  wasSuccessful,
  onChangeField,
  onSelectPackage,
  onSubmit,
}: BookingRequestFormProps) {
  return (
    <div className="space-y-6">
      {selectedPackage ? (
        <div className="rounded-2xl border border-fuchsia-400/20 bg-fuchsia-500/10 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-fuchsia-200">Selected</p>
          <div className="mt-2 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-white">{selectedPackage.name}</h3>
              <p className="mt-1 text-sm text-zinc-300">
                {formatCurrencyFromCents(selectedPackage.priceInCents)} ·{' '}
                {selectedPackage.durationMinutes} minutes
              </p>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-zinc-200">
              Active package
            </span>
          </div>
        </div>
      ) : null}

      {submitMessage ? (
        <InlineNotice variant={wasSuccessful ? 'success' : 'error'}>
          {submitMessage}
        </InlineNotice>
      ) : null}

      <form className="grid gap-4" onSubmit={onSubmit}>
        <Field error={fieldErrors['customer.fullName']} label="Full name">
          <Input
            placeholder="Ava Lens"
            value={form.fullName}
            onChange={(event) => onChangeField('fullName', event.target.value)}
          />
        </Field>

        <Field error={fieldErrors['customer.email']} label="Email">
          <Input
            placeholder="ava@example.com"
            type="email"
            value={form.email}
            onChange={(event) => onChangeField('email', event.target.value)}
          />
        </Field>

        <Field error={fieldErrors['customer.phone']} hint="Optional" label="Phone">
          <Input
            placeholder="+2301234567"
            value={form.phone}
            onChange={(event) => onChangeField('phone', event.target.value)}
          />
        </Field>

        <Field error={fieldErrors.photographyPackageId} label="Selected package">
          <Select
            value={selectedPackageId}
            onChange={(event) => onSelectPackage(event.target.value)}
          >
            {packages.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          error={fieldErrors.requestedDate}
          hint="This is sent to Spring as an ISO timestamp."
          label="Requested date and time"
        >
          <Input
            type="datetime-local"
            value={form.requestedDate}
            onChange={(event) => onChangeField('requestedDate', event.target.value)}
          />
        </Field>

        <Field
          error={fieldErrors.message}
          hint="Optional, max 5000 characters"
          label="Booking message"
        >
          <Textarea
            placeholder="Sunset beach session with two outfit changes"
            value={form.message}
            onChange={(event) => onChangeField('message', event.target.value)}
          />
        </Field>

        <Button disabled={submitting || packages.length === 0} type="submit">
          {submitting ? 'Submitting request...' : 'Submit booking request'}
        </Button>
      </form>
    </div>
  )
}
