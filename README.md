# SagaVortex Booking API

Photography booking REST API built with Java 26 and Spring Boot 4.

## Phase 6 (current)

Packages API is available at `/api/packages`.
Booking request API is available at `/api/booking-requests`.
Errors now return a consistent JSON format from a global exception handler.

Run Postgres and the app, then try:

```bash
curl -s http://localhost:8080/api/packages | jq

curl -s -X POST http://localhost:8080/api/packages \
  -H "Content-Type: application/json" \
  -d '{"name":"Portrait Session","description":"1-hour studio portrait","priceInCents":15000,"durationMinutes":60}' | jq

curl -s -X POST http://localhost:8080/api/booking-requests \
  -H "Content-Type: application/json" \
  -d '{"customer":{"fullName":"Ava Lens","email":"ava@example.com","phone":"+2301234567"},"photographyPackageId":1,"requestedDate":"2030-06-01T10:00:00Z","message":"Sunset beach session"}' | jq
```

### Start PostgreSQL

```bash
docker compose up -d
```

### Run the application

```bash
mvn spring-boot:run
# or
./mvnw spring-boot:run
```

The server listens on http://localhost:8080. Expect a Whitelabel 404 at `/` because no root controller exists.
