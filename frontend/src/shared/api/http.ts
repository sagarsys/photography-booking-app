import type { ApiErrorResponse } from './types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

function buildUrl(path: string) {
  return `${API_BASE_URL}${path}`
}

async function parseResponse(response: Response) {
  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    return response.json()
  }

  const text = await response.text()
  return text || null
}

export class ApiError extends Error {
  status: number
  body: ApiErrorResponse | null

  constructor(status: number, body: ApiErrorResponse | null, fallbackMessage: string) {
    super(body?.message ?? fallbackMessage)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(buildUrl(path), {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  const body = await parseResponse(response)

  if (!response.ok) {
    throw new ApiError(
      response.status,
      typeof body === 'object' && body !== null ? (body as ApiErrorResponse) : null,
      `Request failed with status ${response.status}`,
    )
  }

  return body as T
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}
