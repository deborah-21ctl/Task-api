# Task Management API

A REST API for managing users, projects, and tasks, built with NestJS, TypeScript, PostgreSQL, TypeORM, JWT authentication, and Swagger.

Users can manage their own projects and the tasks associated with those projects. Project and task routes require authentication and enforce ownership.

## Features

- User registration and login with bcrypt password hashing
- JWT authentication for protected routes
- Create, list, view, update, and delete projects
- Create, list, view, update, and delete tasks within projects
- Project ownership checks for projects and their tasks
- Task status, due dates, pagination, filtering, and sorting
- Request validation and a consistent HTTP exception response
- PostgreSQL with TypeORM migrations
- Interactive Swagger documentation

## Requirements

- Node.js (the project uses Node.js 24)
- npm
- Docker Desktop, or another PostgreSQL 16 server

## Setup

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root, using `.env.example` as a template:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=task_api

JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=1h

SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=your_ethereal_username
SMTP_PASSWORD=your_ethereal_password
```

The values above match the repository's Docker Compose database defaults. If you change the database credentials in `docker-compose.yml`, update the corresponding `.env` values too. Keep `.env` private; do not commit secrets or real credentials.

For password-reset emails, create a test account at [Ethereal Email](https://ethereal.email/) and use its SMTP username and password above. Ethereal captures messages in its web inbox instead of delivering them to real recipients.

`JWT_EXPIRES_IN` is required by environment validation. The current JWT module sets token expiry to one hour.

Start PostgreSQL:

```bash
docker compose up -d
```

Apply database migrations:

```bash
npx tsx ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
```

Start the API in development mode:

```bash
npm run start:dev
```

The API is available at `http://localhost:3000` (or the port set in `.env`).

## Swagger / OpenAPI

Open Swagger UI at:

```text
http://localhost:3000/docs
```

Swagger provides request and response documentation and lets you try the endpoints. To call protected endpoints:

1. Register with `POST /auth/register`.
2. Verify the email with `POST /auth/verify-email` using the code sent to the address.
3. Log in with `POST /auth/login`.
4. Copy the `access_token` from the response.
5. Select **Authorize** in Swagger and enter the token.

For requests outside Swagger, send the access token returned by login using the HTTP bearer authentication scheme in the `Authorization` header.

## API overview

### Authentication

| Method | Endpoint | Description | Authentication |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Create an account and send an email verification code | No |
| `POST` | `/auth/verify-email` | Verify an email address using the emailed code | No |
| `POST` | `/auth/login` | Log in and receive a JWT | No |
| `GET` | `/auth/me` | Get the current token's user claims | JWT required |

Register request:

```json
{
  "fullName": "Jordan Smith",
  "phoneNumber": "+14155552671",
  "email": "user@example.com",
  "password": "MySecurePass123!"
}
```

Use an international phone number with its country code (for example, `+14155552671`).
Passwords must be 16–72 characters and include uppercase and lowercase letters, a number, and a special character, with no spaces. Common passwords are rejected.

Invalid request fields return HTTP `400` with field-specific messages, for example:

```json
{
  "statusCode": 400,
  "success": false,
  "message": "Validation failed",
  "errors": {
    "password": [
      "Password must contain at least 16 characters."
    ]
  },
  "path": "/auth/register"
}
```

Login uses a generic `401 Invalid email or password` response for incorrect credentials. If the credentials are correct but the email has not been verified, login returns `403 Please verify your email before logging in`.

Successful registration creates an unverified account, sends a verification code to the email address, and returns a message asking the user to enter that code:

```json
{
  "id": 1,
  "fullName": "Jordan Smith",
  "phoneNumber": "+14155552671",
  "email": "user@example.com",
  "message": "A verification code has been sent to your email. Enter the OTP to verify your email and complete registration."
}
```

Verify the email using the code sent during registration:

```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

An account must be verified before it can log in.

Login returns an access token:

```json
{
  "access_token": "<JWT>"
}
```

### Projects

All project endpoints require a bearer token and operate only on projects owned by the authenticated user.

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/projects` | Create a project |
| `GET` | `/projects` | List your projects |
| `GET` | `/projects/:id` | Get one of your projects |
| `PATCH` | `/projects/:id` | Update your project |
| `DELETE` | `/projects/:id` | Delete your project |

Create project request:

```json
{
  "name": "Website Project",
  "description": "Build the company website"
}
```

### Tasks

Tasks are scoped to a project. The authenticated user must own the project.

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/projects/:projectId/tasks` | Create a task in a project |
| `GET` | `/projects/:projectId/tasks` | List tasks in a project |
| `GET` | `/projects/:projectId/tasks/:taskId` | Get one task |
| `PATCH` | `/projects/:projectId/tasks/:taskId` | Update a task |
| `DELETE` | `/projects/:projectId/tasks/:taskId` | Delete a task |

Create task request:

```json
{
  "title": "Fix server issue",
  "description": "Investigate the server outage",
  "status": "TODO",
  "dueDate": "2026-10-10"
}
```

Allowed task statuses are `TODO`, `IN_PROGRESS`, and `DONE`. The due date must be a valid date string.

Update a task by sending only the fields to change:

```json
{
  "status": "DONE"
}
```

### Task list query parameters

The task list endpoint accepts these optional query parameters:

| Parameter | Description | Example |
| --- | --- | --- |
| `page` | Page number (defaults to `1`) | `page=2` |
| `limit` | Maximum tasks per page (defaults to `10`) | `limit=20` |
| `status` | Filter by task status | `status=TODO` |
| `sort` | Set to `duedate` to sort by earliest due date first | `sort=duedate` |

You can combine filters:

```text
GET /projects/1/tasks?page=1&limit=10&status=TODO&sort=duedate
```

The endpoint returns an array of matching tasks. Pagination metadata is not currently included in the response.

## Validation and errors

The global NestJS `ValidationPipe` validates DTOs, transforms incoming values, and removes properties that are not in the DTO. Invalid request data returns a `400` response.

Successful responses include the actual HTTP status code and a message. The endpoint result is included in `data` when present:

```json
{
  "statusCode": 201,
  "success": true,
  "message": "Request successful",
  "data": {
    "id": 1
  }
}
```

When an endpoint returns a message, that message is used in the response envelope.

The HTTP exception filter returns errors in this shape:

```json
{
  "statusCode": 404,
  "success": false,
  "message": "Project not found",
  "path": "/projects/999"
}
```

The status code and message vary according to the error.

## Database and migrations

The API uses PostgreSQL. The default Docker Compose configuration runs PostgreSQL 16 on host port `5433` and stores its data in a named Docker volume.

TypeORM schema synchronization is disabled; use migrations to apply schema changes.

Show migration status:

```bash
npx tsx ./node_modules/typeorm/cli.js migration:show -d ./src/data-source.ts
```

Run pending migrations:

```bash
npx tsx ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
```

Generate a migration after changing entities:

```bash
npx tsx ./node_modules/typeorm/cli.js migration:generate ./src/migrations/DescribeYourChange -d ./src/data-source.ts
```

Review generated migrations before running them, especially on databases containing important data.

## Useful commands

```bash
npm run start:dev   # Run the API in watch mode
npm run build       # Compile the application
npm run start:prod  # Run the compiled application
npm test            # Run unit tests
npm run test:e2e    # Run end-to-end tests
npm run test:cov    # Run tests with coverage
```

Start or stop the database container:

```bash
docker compose up -d
docker compose down
```

## Security notes

- Passwords are stored as bcrypt hashes.
- Project and task access is restricted by ownership.
- Use a strong, unique `JWT_SECRET` outside local development.
- Never commit `.env` files, JWT secrets, or database credentials.
