import type { PhotographyPackageResponse } from '../../../shared/api/types'
import { formatCurrencyFromCents } from '../../../shared/lib/format'
import { Button } from '../../../shared/ui/button'
import { EmptyState } from '../../../shared/ui/empty-state'
import { InlineNotice } from '../../../shared/ui/inline-notice'

interface PackageCatalogProps {
  packages: PhotographyPackageResponse[]
  packagesError: string | null
  packagesLoading: boolean
  selectedPackageId: string
  onRetry: () => void
  onSelectPackage: (packageId: string) => void
}

export function PackageCatalog({
  packages,
  packagesError,
  packagesLoading,
  selectedPackageId,
  onRetry,
  onSelectPackage,
}: PackageCatalogProps) {
  if (packagesLoading) {
    return <InlineNotice>Loading packages...</InlineNotice>
  }

  if (packagesError) {
    return (
      <div className="space-y-4">
        <InlineNotice variant="error">{packagesError}</InlineNotice>
        <Button onClick={onRetry} variant="secondary">
          Retry package load
        </Button>
      </div>
    )
  }

  if (packages.length === 0) {
    return (
      <EmptyState
        title="No active packages"
        description="The Spring service only exposes active packages, so there is nothing bookable right now."
      />
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {packages.map((item) => {
        const isSelected = item.id === Number(selectedPackageId)

        return (
          <article
            key={item.id}
            className={`rounded-2xl border p-5 transition ${
              isSelected
                ? 'border-fuchsia-400/60 bg-fuchsia-500/10 shadow-lg shadow-fuchsia-500/10'
                : 'border-white/10 bg-white/[0.03]'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {item.description || 'No description provided yet.'}
                </p>
              </div>
              {isSelected ? (
                <span className="rounded-full bg-fuchsia-500/15 px-3 py-1 text-xs font-semibold text-fuchsia-200 ring-1 ring-fuchsia-400/20">
                  Selected
                </span>
              ) : null}
            </div>

            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/[0.04] p-3">
                <dt className="text-xs uppercase tracking-[0.2em] text-zinc-500">Price</dt>
                <dd className="mt-1 text-sm font-medium text-white">
                  {formatCurrencyFromCents(item.priceInCents)}
                </dd>
              </div>
              <div className="rounded-2xl bg-white/[0.04] p-3">
                <dt className="text-xs uppercase tracking-[0.2em] text-zinc-500">Duration</dt>
                <dd className="mt-1 text-sm font-medium text-white">
                  {item.durationMinutes} minutes
                </dd>
              </div>
            </dl>

            <div className="mt-5">
              <Button
                className="w-full"
                variant={isSelected ? 'secondary' : 'primary'}
                onClick={() => onSelectPackage(String(item.id))}
                type="button"
              >
                {isSelected ? 'Selected package' : 'Book this package'}
              </Button>
            </div>
          </article>
        )
      })}
    </div>
  )
}
