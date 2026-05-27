# Frontend Architecture

The frontend lives in `frontend/` and is a Vite + React + TypeScript application.

## High-level design

- **`src/app`**: app shell, routing, top-level navigation.
- **`src/features`**: feature slices (public booking, admin bookings, admin packages, admin customers).
- **`src/shared`**: reusable UI, shared API client, and generic utilities.

Pages are intentionally thin and composed from feature components + hooks. Business logic (validation, state transitions, transformations) lives in feature `lib` and `hooks`.

## Routes

- `/`: customer booking flow
- `/admin/bookings`: booking status management
- `/admin/packages`: package create/update/deactivate
- `/admin/customers`: read-only customer directory derived from bookings

## API integration

- Base HTTP client: `frontend/src/shared/api/http.ts`
- API models: `frontend/src/shared/api/types.ts`
- Feature API modules:
  - `frontend/src/features/bookings/api/bookingApi.ts`
  - `frontend/src/features/packages/api/packageApi.ts`

The app uses `VITE_API_BASE_URL`:

- Development: `frontend/.env.development`
- Production: `frontend/.env.production`

## Aliases

Imports use `@/*` (configured in `frontend/tsconfig.app.json` and `frontend/vite.config.ts`) to keep imports readable:

- `@/app/...`
- `@/features/...`
- `@/shared/...`
