import type { FormEvent } from 'react'
import { PackageEditorForm } from '@/features/admin-packages/components/PackageEditorForm'
import { PackageList } from '@/features/admin-packages/components/PackageList'
import { useAdminPackages } from '@/features/admin-packages/hooks/useAdminPackages'
import { Button } from '@/shared/ui/button'
import { Card, CardTitle } from '@/shared/ui/card'
import { InlineNotice } from '@/shared/ui/inline-notice'
import { PageHeader } from '@/shared/ui/page-header'

export function AdminPackagesPage() {
  const {
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
  } = useAdminPackages()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void savePackage()
  }

  function handleDeactivate(packageItem: (typeof filteredPackages)[number]) {
    const confirmed = window.confirm(
      `Deactivate "${packageItem.name}"? The Java API will hide it from future package lists.`,
    )

    if (!confirmed) {
      return
    }

    void removePackage(packageItem)
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Manage photography packages"
        description="This page works with the existing package endpoints only. Because the Java service filters inactive records out of reads, deactivated packages disappear from the admin list after the delete call succeeds."
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="space-y-6">
          <CardTitle
            title={editingPackageId ? 'Edit package' : 'Create package'}
            description="The form mirrors the Java package request DTO: name, optional description, positive price in cents, and positive duration in minutes."
          />

          {errorMessage ? <InlineNotice variant="error">{errorMessage}</InlineNotice> : null}

          <PackageEditorForm
            editingPackageId={editingPackageId}
            fieldErrors={fieldErrors}
            form={form}
            submitting={submitting}
            onCancelEdit={resetForm}
            onChangeField={setFormValue}
            onSubmit={handleSubmit}
          />
        </Card>

        <Card className="space-y-6">
          <CardTitle
            title="Active packages"
            description="Only active packages are visible because `GET /api/packages` comes from the Java service method that filters `active = true`."
            action={
              <Button onClick={() => void loadPackages()} variant="secondary">
                Refresh
              </Button>
            }
          />

          <PackageList
            deactivatingPackageId={deactivatingPackageId}
            editingPackageId={editingPackageId}
            loading={loading}
            packages={filteredPackages}
            search={search}
            onDeactivate={handleDeactivate}
            onEdit={startEdit}
            onSearchChange={setSearch}
          />
        </Card>
      </div>
    </div>
  )
}
