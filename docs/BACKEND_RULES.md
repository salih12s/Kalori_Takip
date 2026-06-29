# Backend Rules

## Hard rules

- Use TypeScript.
- Use Express.
- Use Prisma.
- Use PostgreSQL.
- Use Zod validation.
- Use bcrypt for passwords.
- Use JWT for auth.
- Do not put Prisma queries in controllers.
- Do not put business logic in controllers.
- Use global error handling.
- Use consistent API responses.

## Layer responsibilities

### Routes
- Define endpoints.
- Attach middleware.
- Call controller.

### Controller
- Read request.
- Call service.
- Return response.

### Service
- Business logic.
- Scoring logic.
- Daily total updates.
- Privacy checks.
- Streak calculation.

### Repository
- Prisma queries only.

### Validation
- Zod schemas.

## Response format

Success:

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

## Auth rule

Authenticated request must expose:

```ts
req.user = {
  id: string,
  email: string,
  username: string
}
```

## Access rule

Users can only modify their own data.

Private profile data must not be exposed to unauthorized users.
