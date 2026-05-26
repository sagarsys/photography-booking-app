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
