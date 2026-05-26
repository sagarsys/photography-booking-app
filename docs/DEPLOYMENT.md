# Deployment

This project is prepared for a Docker-based deployment on Render.

## Why Docker

- keeps Java 26 under your control
- makes local, CI, and hosted builds consistent
- avoids relying on a platform-native Java runtime version

## Files used for deployment

- `Dockerfile`
- `.dockerignore`
- `render.yaml`
- `.github/workflows/ci.yml`
- `.github/workflows/deploy.yml`

## Render setup

### 1. Push the repository to GitHub

Render and GitHub Actions both need the repository online.

### 2. Create a PostgreSQL database on Render

Create a managed PostgreSQL instance in Render and collect these values:

- host
- port
- database name
- username
- password

### 3. Create the web service

Use the repository root `render.yaml` blueprint or create a web service manually in the Render dashboard.

This repo expects:

- runtime: Docker
- Dockerfile path: `./Dockerfile`
- health check path: `/api/packages`
- auto deploy from Render: off

`render.yaml` already sets the service to Docker and disables automatic Render deploys so GitHub Actions can control production deploys.

### 4. Configure environment variables in Render

Set these on the Render web service:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `SPRING_JPA_HIBERNATE_DDL_AUTO=validate`

Example JDBC URL format:

```text
jdbc:postgresql://<host>:<port>/<database>
```

If Render requires SSL for the connection mode you use, append the provider-required JDBC parameters there.

## GitHub Actions CI/CD

This repository includes two workflows:

- `CI`
  - runs on pull requests
  - runs on pushes to `main`
  - executes `./mvnw test`
  - builds the Docker image to verify deployment packaging

- `Deploy`
  - runs only after the `CI` workflow succeeds
  - triggers only for pushes to `main`
  - calls the Render deploy hook

## Required GitHub secret

Add this repository secret in GitHub:

- `RENDER_DEPLOY_HOOK_URL`

To get it:

1. Open your Render web service
2. Go to **Settings**
3. Create or copy the **Deploy Hook**
4. Add it in GitHub under:
   `Settings -> Secrets and variables -> Actions`

## Deployment flow

1. Open a pull request
2. GitHub Actions runs the CI workflow
3. Merge into `main`
4. GitHub Actions runs CI again on the `main` push
5. If CI succeeds, the deploy workflow calls Render's deploy hook
6. Render rebuilds and redeploys the Dockerized application

## Useful deployment commands

Build the jar locally:

```bash
./mvnw clean package
```

Build the Docker image locally:

```bash
docker build -t sagavortex-booking-api .
```

Run the Docker image locally with explicit env vars:

```bash
docker run --rm \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/sagavortex_booking \
  -e SPRING_DATASOURCE_USERNAME=sagavortex \
  -e SPRING_DATASOURCE_PASSWORD=7fKp9mN2xQ4vLw8sRtZ1 \
  -e PORT=8080 \
  -p 8080:8080 \
  sagavortex-booking-api
```

## Free-tier caveats

If you use Render's free web service/database options:

- the web service may sleep after inactivity
- the first request after sleeping may be slow
- free database limits are lower than paid plans
