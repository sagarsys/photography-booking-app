# SagaVortex Booking API

SagaVortex Booking API is a Spring Boot backend for a photography booking system.
It manages photography packages, customers, booking requests, booking status updates,
Flyway database migrations, and PostgreSQL-backed tests.

## Stack

- Java 26
- Spring Boot 4
- Maven
- PostgreSQL
- Spring Data JPA
- Flyway
- Jakarta Validation
- Lombok
- JUnit 5 / Mockito / MockMvc / Testcontainers

## What it does

- Create, update, list, and deactivate photography packages
- Create booking requests tied to customers and packages
- Track booking request status through a small workflow:
  `PENDING -> CONFIRMED -> COMPLETED`, with cancellation allowed from `PENDING` or `CONFIRMED`
- Return consistent JSON error responses for validation failures, not-found cases, and bad requests

## Prerequisites

- Java 26
- Docker

## Run locally

### 1. Start PostgreSQL

```bash
docker compose up -d
```

If you changed database credentials after the container was first created, recreate the volume:

```bash
docker compose down -v
docker compose up -d
```

### 2. Run the application

```bash
mvn spring-boot:run
```

or with the Maven wrapper:

```bash
./mvnw spring-boot:run
```

The API runs at `http://localhost:8080`.

## Useful Maven commands

```bash
mvn compile
mvn test
mvn spring-boot:run
```

Wrapper equivalents:

```bash
./mvnw compile
./mvnw test
./mvnw spring-boot:run
```

## API

### Packages

#### List packages

```http
GET /api/packages
```

#### Get package by id

```http
GET /api/packages/{id}
```

#### Create package

```http
POST /api/packages
Content-Type: application/json
```

```json
{
  "name": "Portrait Session",
  "description": "1-hour studio portrait",
  "priceInCents": 15000,
  "durationMinutes": 60
}
```

#### Update package

```http
PUT /api/packages/{id}
Content-Type: application/json
```

```json
{
  "name": "Portrait Session Plus",
  "description": "90-minute portrait session",
  "priceInCents": 22000,
  "durationMinutes": 90
}
```

#### Deactivate package

```http
DELETE /api/packages/{id}
```

### Booking requests

#### Create booking request

```http
POST /api/booking-requests
Content-Type: application/json
```

```json
{
  "customer": {
    "fullName": "Ava Lens",
    "email": "ava@example.com",
    "phone": "+2301234567"
  },
  "photographyPackageId": 1,
  "requestedDate": "2030-06-01T10:00:00Z",
  "message": "Sunset beach session"
}
```

#### List booking requests

```http
GET /api/booking-requests
```

#### Get booking request by id

```http
GET /api/booking-requests/{id}
```

#### Update booking status

```http
PATCH /api/booking-requests/{id}/status
Content-Type: application/json
```

```json
{
  "status": "CONFIRMED"
}
```

Supported statuses:

- `PENDING`
- `CONFIRMED`
- `CANCELLED`
- `COMPLETED`

## Example flow

Replace `1` with the ids returned by your own package and booking creation calls.


```bash
curl -s -X POST http://localhost:8080/api/packages \
  -H "Content-Type: application/json" \
  -d '{"name":"Portrait Session","description":"1-hour studio portrait","priceInCents":15000,"durationMinutes":60}'

curl -s -X POST http://localhost:8080/api/booking-requests \
  -H "Content-Type: application/json" \
  -d '{"customer":{"fullName":"Ava Lens","email":"ava@example.com","phone":"+2301234567"},"photographyPackageId":1,"requestedDate":"2030-06-01T10:00:00Z","message":"Sunset beach session"}'

curl -s http://localhost:8080/api/booking-requests

curl -s -X PATCH http://localhost:8080/api/booking-requests/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"CONFIRMED"}'
```

## Tests

Run the full test suite:

```bash
mvn test
```

Current test coverage includes:

- service unit tests with Mockito
- controller tests with MockMvc
- PostgreSQL integration tests with Testcontainers

## Deployment

This project is prepared for a Docker-based deployment on Render.

Why Docker:

- keeps Java 26 under your control
- makes local, CI, and hosted builds consistent
- avoids relying on a platform-native Java runtime version

### Files used for deployment

- `Dockerfile`
- `.dockerignore`
- `render.yaml`
- `.github/workflows/ci.yml`
- `.github/workflows/deploy.yml`

### Render setup

#### 1. Push the repository to GitHub

Render and GitHub Actions both need the repository online.

#### 2. Create a PostgreSQL database on Render

Create a managed PostgreSQL instance in Render and collect these values:

- host
- port
- database name
- username
- password

#### 3. Create the web service

Use the repository root `render.yaml` blueprint or create a web service manually in the Render dashboard.

This repo expects:

- runtime: Docker
- Dockerfile path: `./Dockerfile`
- health check path: `/api/packages`
- auto deploy from Render: off

`render.yaml` already sets the service to Docker and disables automatic Render deploys so GitHub Actions can control production deploys.

#### 4. Configure environment variables in Render

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

### GitHub Actions CI/CD

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

### Required GitHub secret

Add this repository secret in GitHub:

- `RENDER_DEPLOY_HOOK_URL`

To get it:

1. Open your Render web service
2. Go to **Settings**
3. Create or copy the **Deploy Hook**
4. Add it in GitHub under:
   `Settings -> Secrets and variables -> Actions`

### Deployment flow

1. Open a pull request
2. GitHub Actions runs the CI workflow
3. Merge into `main`
4. GitHub Actions runs CI again on the `main` push
5. If CI succeeds, the deploy workflow calls Render's deploy hook
6. Render rebuilds and redeploys the Dockerized application

### Useful deployment commands

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

### Free-tier caveats

If you use Render's free web service/database options:

- the web service may sleep after inactivity
- the first request after sleeping may be slow
- free database limits are lower than paid plans
