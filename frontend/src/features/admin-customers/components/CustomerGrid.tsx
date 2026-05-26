import type { AdminCustomerSummary } from '@/features/customers/lib/summarizeCustomers'
import { formatDateTime } from '@/shared/lib/format'
import { StatusBadge } from '@/shared/ui/status-badge'

export function CustomerGrid({
  customers,
}: {
  customers: AdminCustomerSummary[]
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {customers.map((customer) => (
        <article
          key={customer.email.toLowerCase()}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white">{customer.fullName}</h3>
              <p className="mt-1 text-sm text-zinc-300">{customer.email}</p>
              <p className="mt-1 text-sm text-zinc-500">
                {customer.phone || 'No phone provided'}
              </p>
            </div>
            <StatusBadge status={customer.latestStatus} />
          </div>

          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/[0.04] p-3">
              <dt className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Booking count
              </dt>
              <dd className="mt-1 text-base font-semibold text-white">
                {customer.bookingCount}
              </dd>
            </div>
            <div className="rounded-2xl bg-white/[0.04] p-3">
              <dt className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Latest booking
              </dt>
              <dd className="mt-1 text-base font-semibold text-white">
                #{customer.latestBookingId}
              </dd>
            </div>
          </dl>

          <div className="mt-4 rounded-2xl bg-white/[0.04] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Latest requested date
            </p>
            <p className="mt-2 text-sm font-medium text-white">
              {formatDateTime(customer.latestRequestedDate)}
            </p>
          </div>

          <div className="mt-4">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Packages requested
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {customer.packageNames.map((packageName) => (
                <span
                  key={packageName}
                  className="rounded-full bg-white/[0.05] px-3 py-1 text-xs font-medium text-zinc-300"
                >
                  {packageName}
                </span>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
