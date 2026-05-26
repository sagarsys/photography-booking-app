export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'

export interface CustomerRequest {
  fullName: string
  email: string
  phone?: string | null
}

export interface BookingRequestCreateRequest {
  customer: CustomerRequest
  photographyPackageId: number
  requestedDate: string
  message?: string | null
}

export interface PhotographyPackageRequest {
  name: string
  description?: string | null
  priceInCents: number
  durationMinutes: number
}

export interface BookingStatusUpdateRequest {
  status: BookingStatus
}

export interface CustomerResponse {
  id: number
  fullName: string
  email: string
  phone: string | null
  createdAt: string
  updatedAt: string
}

export interface PhotographyPackageResponse {
  id: number
  name: string
  description: string | null
  priceInCents: number
  durationMinutes: number
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface BookingRequestResponse {
  id: number
  customer: CustomerResponse
  photographyPackage: PhotographyPackageResponse
  requestedDate: string
  message: string | null
  status: BookingStatus
  createdAt: string
  updatedAt: string
}

export interface ApiErrorResponse {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
  fieldErrors?: Record<string, string> | null
}
