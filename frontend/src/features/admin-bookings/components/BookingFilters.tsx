import type { BookingStatus } from '@/shared/api/types'
import { Input, Select } from '@/shared/ui/form-controls'

interface BookingFiltersProps {
  search: string
  statusFilter: 'ALL' | BookingStatus
  onSearchChange: (value: string) => void
  onStatusFilterChange: (value: 'ALL' | BookingStatus) => void
}

export function BookingFilters({
  search,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
}: BookingFiltersProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-[0.75fr_0.25fr]">
      <Input
        placeholder="Search by customer or package"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />
      <Select
        value={statusFilter}
        onChange={(event) => onStatusFilterChange(event.target.value as 'ALL' | BookingStatus)}
      >
        <option value="ALL">All statuses</option>
        <option value="PENDING">Pending</option>
        <option value="CONFIRMED">Confirmed</option>
        <option value="CANCELLED">Cancelled</option>
        <option value="COMPLETED">Completed</option>
      </Select>
    </div>
  )
}
