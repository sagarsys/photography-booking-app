import type { PhotographyPackageRequest } from '@/shared/api/types'

export interface PackageFormValues {
  name: string
  description: string
  priceInCents: string
  durationMinutes: string
}

export const initialPackageFormValues: PackageFormValues = {
  name: '',
  description: '',
  priceInCents: '',
  durationMinutes: '',
}

export function validatePackageForm(input: PackageFormValues) {
  const fieldErrors: Record<string, string> = {}

  if (!input.name.trim()) {
    fieldErrors.name = 'Package name is required'
  } else if (input.name.trim().length > 255) {
    fieldErrors.name = 'Package name must be at most 255 characters'
  }

  if (input.description.trim().length > 5000) {
    fieldErrors.description = 'Description must be at most 5000 characters'
  }

  const price = Number.parseInt(input.priceInCents, 10)
  if (!input.priceInCents.trim()) {
    fieldErrors.priceInCents = 'Package price is required'
  } else if (!Number.isInteger(price) || price <= 0) {
    fieldErrors.priceInCents = 'Package price must be a positive whole number'
  }

  const duration = Number.parseInt(input.durationMinutes, 10)
  if (!input.durationMinutes.trim()) {
    fieldErrors.durationMinutes = 'Package duration is required'
  } else if (!Number.isInteger(duration) || duration <= 0) {
    fieldErrors.durationMinutes = 'Package duration must be a positive whole number'
  }

  return fieldErrors
}

export function toPackageRequest(input: PackageFormValues): PhotographyPackageRequest {
  return {
    name: input.name.trim(),
    description: input.description.trim() || null,
    priceInCents: Number.parseInt(input.priceInCents, 10),
    durationMinutes: Number.parseInt(input.durationMinutes, 10),
  }
}
