# API Reference

## Base URL

Local development:

```text
http://localhost:8080
```

## Packages

### List packages

```http
GET /api/packages
```

### Get package by id

```http
GET /api/packages/{id}
```

### Create package

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

### Update package

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

### Deactivate package

```http
DELETE /api/packages/{id}
```

## Booking requests

### Create booking request

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

### List booking requests

```http
GET /api/booking-requests
```

### Get booking request by id

```http
GET /api/booking-requests/{id}
```

### Update booking status

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
