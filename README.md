# SagaVortex Booking API

Photography booking REST API built with Java 26 and Spring Boot 4.

## Phase 1 (current)

Project scaffolding only — no runnable app yet. Phase 2 adds the Spring Boot entry point.

### Prerequisites

- Java 26 JDK
- Docker (for local PostgreSQL)

### Start PostgreSQL

```bash
docker compose up -d
```

### Verify Maven setup

Use **either** your Homebrew Maven or the project wrapper (same result):

```bash
mvn validate
# or
./mvnw validate
```

The wrapper pins Maven 3.9.16 so CI and other machines don't need a global install.
