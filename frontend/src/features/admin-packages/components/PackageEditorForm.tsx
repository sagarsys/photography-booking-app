import type { FormEvent } from 'react'
import type { PackageFormValues } from '@/features/packages/lib/packageForm'
import { Button } from '@/shared/ui/button'
import { Field } from '@/shared/ui/field'
import { Input, Textarea } from '@/shared/ui/form-controls'

interface PackageEditorFormProps {
  editingPackageId: number | null
  fieldErrors: Record<string, string>
  form: PackageFormValues
  submitting: boolean
  onCancelEdit: () => void
  onChangeField: (key: keyof PackageFormValues, value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function PackageEditorForm({
  editingPackageId,
  fieldErrors,
  form,
  submitting,
  onCancelEdit,
  onChangeField,
  onSubmit,
}: PackageEditorFormProps) {
  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <Field error={fieldErrors.name} label="Package name">
        <Input
          placeholder="Portrait Session"
          value={form.name}
          onChange={(event) => onChangeField('name', event.target.value)}
        />
      </Field>

      <Field
        error={fieldErrors.description}
        hint="Optional, max 5000 characters"
        label="Description"
      >
        <Textarea
          placeholder="A polished 90-minute portrait session for couples, families, or solo bookings."
          value={form.description}
          onChange={(event) => onChangeField('description', event.target.value)}
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          error={fieldErrors.priceInCents}
          hint="The backend stores price in cents."
          label="Price in cents"
        >
          <Input
            inputMode="numeric"
            placeholder="15000"
            value={form.priceInCents}
            onChange={(event) => onChangeField('priceInCents', event.target.value)}
          />
        </Field>

        <Field
          error={fieldErrors.durationMinutes}
          hint="Positive integer"
          label="Duration in minutes"
        >
          <Input
            inputMode="numeric"
            placeholder="60"
            value={form.durationMinutes}
            onChange={(event) => onChangeField('durationMinutes', event.target.value)}
          />
        </Field>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button disabled={submitting} type="submit">
          {submitting
            ? 'Saving package...'
            : editingPackageId
              ? 'Save package changes'
              : 'Create package'}
        </Button>
        {editingPackageId ? (
          <Button onClick={onCancelEdit} type="button" variant="ghost">
            Cancel edit
          </Button>
        ) : null}
      </div>
    </form>
  )
}
