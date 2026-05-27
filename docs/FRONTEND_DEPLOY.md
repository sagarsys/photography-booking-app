# Frontend Deploy (Vercel)

This repository deploys the frontend from `frontend/` to Vercel using:

- `.github/workflows/frontend-vercel.yml`

## Trigger behavior

The workflow runs on pushes to `main` only when one of these paths changes:

- `frontend/**`
- `.github/workflows/frontend-vercel.yml`

## Required GitHub secrets

Add these repository secrets in GitHub Actions:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Required Vercel project settings

- Project root directory: `frontend`
- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`

## CI deploy strategy

The GitHub workflow runs frontend quality gates locally (`npm run lint`, `npm run build`) and then performs a direct production deploy with:

- `vercel deploy --prod --yes`

This avoids CI failures related to local `vercel build --prebuilt` shell spawning in some environments.

## API base URL

The frontend API URL is set by Vite env files:

- Development: `frontend/.env.development` -> `http://localhost:8080`
- Production: `frontend/.env.production` -> `https://sagavortex-booking-api.onrender.com`

`VITE_API_BASE_URL` is read in `frontend/src/shared/api/http.ts`.
