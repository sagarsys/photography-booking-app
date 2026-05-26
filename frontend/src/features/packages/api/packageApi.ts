import { request } from '@/shared/api/http'
import type {
  PhotographyPackageRequest,
  PhotographyPackageResponse,
} from '@/shared/api/types'

export function getPackages() {
  return request<PhotographyPackageResponse[]>('/api/packages')
}

export function createPackage(payload: PhotographyPackageRequest) {
  return request<PhotographyPackageResponse>('/api/packages', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updatePackage(id: number, payload: PhotographyPackageRequest) {
  return request<PhotographyPackageResponse>(`/api/packages/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function deactivatePackage(id: number) {
  await request<null>(`/api/packages/${id}`, {
    method: 'DELETE',
  })
}
