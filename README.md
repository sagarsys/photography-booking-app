# SagaVortex Booking API

Photography booking REST API built with Java 26 and Spring Boot 4.

## Phase 2 (current)

The app has a main class and can start. No REST endpoints yet — Phase 3 adds the first API.

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

The server listens on http://localhost:8080. Expect a Whitelabel 404 at `/` until controllers are added in Phase 3.
