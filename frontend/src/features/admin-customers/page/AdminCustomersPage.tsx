import { Button } from '../../../shared/ui/button'
import { Card, CardTitle } from '../../../shared/ui/card'
import { EmptyState } from '../../../shared/ui/empty-state'
import { Input } from '../../../shared/ui/form-controls'
import { InlineNotice } from '../../../shared/ui/inline-notice'
import { PageHeader } from '../../../shared/ui/page-header'
import { CustomerGrid } from '../components/CustomerGrid'
import { useAdminCustomers } from '../hooks/useAdminCustomers'

export function AdminCustomersPage() {
  const { errorMessage, filteredCustomers, loadCustomers, loading, search, setSearch } =
    useAdminCustomers()

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Customer visibility from booking data"
        description="The backend has no dedicated customer controller yet, so this screen derives a read-only customer directory from the booking responses that already embed customer details."
      />

      <Card className="space-y-6">
        <CardTitle
          title="Customer directory"
          description="Entries are deduplicated by email, matching how the Java customer service reuses customers."
          action={
            <Button onClick={() => void loadCustomers()} variant="secondary">
              Refresh
            </Button>
          }
        />

        <Input
          placeholder="Search customers by name, email, or phone"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <InlineNotice variant="warning">
          This is read-only on purpose. The current Java API creates or reuses customers during
          booking creation, but it does not expose standalone customer CRUD endpoints yet.
        </InlineNotice>

        {errorMessage ? <InlineNotice variant="error">{errorMessage}</InlineNotice> : null}

        {loading ? (
          <InlineNotice>Loading customers from bookings...</InlineNotice>
        ) : filteredCustomers.length === 0 ? (
          <EmptyState
            title="No customers to show"
            description="Customer entries only appear once there are booking requests in the system."
          />
        ) : (
          <CustomerGrid customers={filteredCustomers} />
        )}
      </Card>
    </div>
  )
}
