import type { PhotographyPackageResponse } from '@/shared/api/types'
import { formatCurrencyFromCents } from '@/shared/lib/format'
import { Button } from '@/shared/ui/button'
import { EmptyState } from '@/shared/ui/empty-state'
import { Input } from '@/shared/ui/form-controls'
import { InlineNotice } from '@/shared/ui/inline-notice'

interface PackageListProps {
  deactivatingPackageId: number | null
  editingPackageId: number | null
  loading: boolean
  packages: PhotographyPackageResponse[]
  search: string
  onDeactivate: (item: PhotographyPackageResponse) => void
  onEdit: (item: PhotographyPackageResponse) => void
  onSearchChange: (value: string) => void
}

export function PackageList({
  deactivatingPackageId,
  editingPackageId,
  loading,
  packages,
  search,
  onDeactivate,
  onEdit,
  onSearchChange,
}: PackageListProps) {
  return (
    <div className="space-y-6">
      <Input
        placeholder="Search packages"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />

      <InlineNotice variant="warning">
        Deactivated packages are hidden by the current backend. This demo can manage active
        packages and deactivate them, but it cannot recover or browse inactive ones yet.
      </InlineNotice>

      {loading ? (
        <InlineNotice>Loading packages...</InlineNotice>
      ) : packages.length === 0 ? (
        <EmptyState
          title="No active packages"
          description="Create a new package or change the search term. The current API does not expose inactive packages."
        />
      ) : (
        <div className="space-y-4">
          {packages.map((item) => {
            const isEditing = editingPackageId === item.id
            const isDeactivating = deactivatingPackageId === item.id

            return (
              <article
                key={item.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                      <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-400/20">
                        Active
                      </span>
                    </div>
                    <p className="text-sm leading-6 text-zinc-400">
                      {item.description || 'No description provided yet.'}
                    </p>
                    <div className="flex flex-wrap gap-2 text-sm text-zinc-300">
                      <span className="rounded-full bg-white/[0.05] px-3 py-1">
                        {formatCurrencyFromCents(item.priceInCents)}
                      </span>
                      <span className="rounded-full bg-white/[0.05] px-3 py-1">
                        {item.durationMinutes} minutes
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => onEdit(item)}
                      type="button"
                      variant={isEditing ? 'secondary' : 'ghost'}
                    >
                      {isEditing ? 'Editing' : 'Edit'}
                    </Button>
                    <Button
                      disabled={isDeactivating}
                      onClick={() => onDeactivate(item)}
                      type="button"
                      variant="danger"
                    >
                      {isDeactivating ? 'Deactivating...' : 'Deactivate'}
                    </Button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
