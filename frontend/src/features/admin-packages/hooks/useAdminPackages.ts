import { useEffect, useMemo, useState } from 'react'
import { isApiError } from '../../../shared/api/http'
import type { PhotographyPackageResponse } from '../../../shared/api/types'
import {
  createPackage,
  deactivatePackage,
  getPackages,
  updatePackage,
} from '../../packages/api/packageApi'
import {
  initialPackageFormValues,
  toPackageRequest,
  validatePackageForm,
  type PackageFormValues,
} from '../../packages/lib/packageForm'

export function useAdminPackages() {
  const [packages, setPackages] = useState<PhotographyPackageResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [editingPackageId, setEditingPackageId] = useState<number | null>(null)
  const [form, setForm] = useState<PackageFormValues>(initialPackageFormValues)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [deactivatingPackageId, setDeactivatingPackageId] = useState<number | null>(null)

  useEffect(() => {
    void loadPackages()
  }, [])

  async function loadPackages() {
    setLoading(true)
    setErrorMessage(null)

    try {
      const response = await getPackages()
      setPackages(response)
    } catch (error) {
      setErrorMessage(isApiError(error) ? error.message : 'Unable to load packages.')
    } finally {
      setLoading(false)
    }
  }

  const filteredPackages = useMemo(() => {
    const query = search.trim().toLowerCase()

    return packages.filter((item) => {
      if (!query) {
        return true
      }

      return (
        item.name.toLowerCase().includes(query) ||
        (item.description ?? '').toLowerCase().includes(query)
      )
    })
  }, [packages, search])

  function resetForm() {
    setForm(initialPackageFormValues)
    setFieldErrors({})
    setEditingPackageId(null)
  }

  function startEdit(item: PhotographyPackageResponse) {
    setEditingPackageId(item.id)
    setFieldErrors({})
    setForm({
      name: item.name,
      description: item.description ?? '',
      priceInCents: String(item.priceInCents),
      durationMinutes: String(item.durationMinutes),
    })
  }

  function setFormValue(key: keyof PackageFormValues, value: string) {
    setForm((current) => ({ ...current, [key]: value }))
    setFieldErrors((current) => {
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  async function savePackage() {
    const nextErrors = validatePackageForm(form)
    setFieldErrors(nextErrors)
    setErrorMessage(null)

    if (Object.keys(nextErrors).length > 0) {
      return false
    }

    setSubmitting(true)

    try {
      if (editingPackageId) {
        const updated = await updatePackage(editingPackageId, toPackageRequest(form))
        setPackages((current) =>
          current
            .map((item) => (item.id === editingPackageId ? updated : item))
            .sort((left, right) => left.name.localeCompare(right.name)),
        )
      } else {
        const created = await createPackage(toPackageRequest(form))
        setPackages((current) =>
          [...current, created].sort((left, right) => left.name.localeCompare(right.name)),
        )
      }

      resetForm()
      return true
    } catch (error) {
      if (isApiError(error)) {
        setFieldErrors(error.body?.fieldErrors ?? {})
        setErrorMessage(error.message)
      } else {
        setErrorMessage('Unable to save the package right now.')
      }
      return false
    } finally {
      setSubmitting(false)
    }
  }

  async function removePackage(item: PhotographyPackageResponse) {
    setDeactivatingPackageId(item.id)
    setErrorMessage(null)

    try {
      await deactivatePackage(item.id)
      setPackages((current) => current.filter((entry) => entry.id !== item.id))

      if (editingPackageId === item.id) {
        resetForm()
      }
    } catch (error) {
      setErrorMessage(
        isApiError(error) ? error.message : 'Unable to deactivate the package.',
      )
    } finally {
      setDeactivatingPackageId(null)
    }
  }

  return {
    deactivatingPackageId,
    editingPackageId,
    errorMessage,
    fieldErrors,
    filteredPackages,
    form,
    loadPackages,
    loading,
    removePackage,
    resetForm,
    savePackage,
    search,
    setFormValue,
    setSearch,
    startEdit,
    submitting,
  }
}
