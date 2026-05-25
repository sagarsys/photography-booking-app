# SagaVortex Booking API

Photography booking REST API built with Java 26 and Spring Boot 4.

## Phase 4 (current)

Packages API is available at `/api/packages`.
Customer persistence is now in place for the upcoming booking-request flow.

Run Postgres and the app, then try:

```bash
curl -s http://localhost:8080/api/packages | jq

curl -s -X POST http://localhost:8080/api/packages \
  -H "Content-Type: application/json" \
  -d '{"name":"Portrait Session","description":"1-hour studio portrait","priceInCents":15000,"durationMinutes":60}' | jq
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
