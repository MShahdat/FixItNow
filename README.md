# FixItNow API

Backend REST API for a home-services marketplace connecting **customers**, **technicians**, and **admins**. Customers browse services, book technicians, and pay via Stripe; technicians list services and manage bookings; admins manage users and categories.

Built with Express + TypeScript, PostgreSQL via Prisma, JWT auth, and Stripe payments.

---

## Tech stack

| Concern | Choice |
|---|---|
| Runtime / framework | Node.js, Express (TypeScript) |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT (access + refresh), bcrypt |
| Payments | Stripe Checkout Sessions + webhooks |
| Validation | Zod (per-route middleware) |
| Error handling | `AppError` + `httpStatus` constants, `catchAsync` wrapper |

---

## Project structure

```
src/
  app.ts                 # Express app: middleware + route mounting
  server.ts              # Bootstraps DB connection and server
  config/                # Env config
  lib/                   # prisma client, stripe client
  middlewares/           # auth, validateRequest, globalErrorHandler, notFound
  utils/                 # catchAsync, jwt, successResponse
  modules/
    auth/                # register, login, current-user
    user/                # customer profile + password
    technician/          # technician profile, availability, bookings
    category/            # service categories (admin)
    service/             # service listings
    booking/             # booking lifecycle
    payment/             # Stripe checkout + webhook
    review/              # customer reviews after a completed booking
    admin/               # user & category management
prisma/
  schema.prisma          # User, TechnicianProfile, Category, Services, Booking, Payment, Review
  migrations/             # SQL migrations
```

Each module follows a `route → controller → service → interface` split.

---

## Getting started

### Prerequisites

Node.js 18+, a PostgreSQL database, and a Stripe account (for payments).

### Install

```bash
npm install
```

### Environment

Copy `.env.example` to `.env` and fill in:

```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
PORT=5000
APP_URL=http://localhost:5000
SOLT_OR_ROUNDS=10
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
STRIPE_SECRET_KEY=sk_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### Database

```bash
npx prisma migrate deploy   # apply migrations
npx prisma generate         # generate the client
```

### Run

```bash
npm run dev     # ts-node-dev / nodemon (development)
npm run build   # tsc -> dist/
npm start       # node dist/server.js (production)
```

For local Stripe webhooks:

```bash
npm run stripe:webhook  # stripe listen --forward-to http://localhost:5000/api/payments/webhook
```

> Note: `express.raw()` must be registered for the webhook route **before** the global `express.json()` middleware, or Stripe's signature verification will fail.

---

## Conventions

### Response envelope

Every success JSON response follows this shape (via `successResponse`):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "…",
  "data": { },
  "meta": { "page": 1, "limit": 10, "total": 42 }
}
```

`meta` is only present on paginated endpoints.


Every not found JSON response follows this shape (via `notFoundResponse`):

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Not Found",
  "data": null,

}
```

Every JSON unauthorized response follows this shape (via `unauthorizedResponse`):

```json
{
  "success": false,
  "statusCode": 401,
  "message": "Unauthorized access",
}
```

Every JSON error response follows this shape (via `errorResponse`):

```json
{
  "success": false,
  "statusCode": 500,
    "message": "…",
    "data": {}
}
```

### Authentication

Send the access token as either an `httpOnly` cookie (`accessToken`, set automatically on login) or an `Authorization: Bearer <token>` header. Protected routes also enforce **roles** — a request with a valid token but the wrong role gets rejected. Blocked users (`status: BLOCKED`) are denied.

Roles: `CUSTOMER` (default), `TECHNICIAN`, `ADMIN`.

### Errors

Errors return the standard envelope with `success: false` and an appropriate status code, thrown via `AppError` and caught by the global error handler. Validation failures (Zod) return `400` with a per-field `errors` array. Prisma errors are mapped (e.g. `P2002` → `409 Conflict`, `P2025` → `404 Not Found`).

---

## Domain lifecycle

**Booking status:** `REQUESTED` → `ACCEPTED` → `PAID` → `IN_PROGRESS` → `COMPLETED` (or `DECLINED` / `CANCELLED`).

1. Customer submits a booking → `REQUESTED`.
2. Technician accepts or declines → `ACCEPTED` / `DECLINED`.
3. Customer pays via Stripe → webhook marks payment `PAID`, booking moves to `PAID`.
4. Technician starts the job → `IN_PROGRESS`, then marks it `COMPLETED`.
5. Once `COMPLETED`, the customer may leave one review.

> Customers can cancel a booking at any point before it reaches `IN_PROGRESS`.

**Payment status:** `PENDING` → `PAID` / `FAILED` / `REFUNDED`.

Webhook handling is idempotent — replayed Stripe events for an already-processed `paymentIntentId`/`transactionId` are safely ignored rather than double-applied.

---

## API reference

Base URL: `http://localhost:<PORT>`
All routes are prefixed as shown. **Auth** column = required role(s); "Public" = no token needed.

### Auth — `/api/auth`

| Method | Path | Auth | Body | Description |
|---|---|---|---|---|
| POST | `/register` | Public | `{ firstName, lastName?, email, password, phone, role, bio?, skills?, experience?, hourlyRate?, availability? }` | Register a `CUSTOMER` or `TECHNICIAN`. Technicians must include `role: "TECHNICIAN"`, `hourlyRate`, and `availability`. |
| POST | `/login` | Public | `{ email, password }` | Log in; sets `accessToken` and `refreshToken` cookies and returns tokens. |
| POST | `/access-token` | Public (uses `refreshToken` cookie) | — | Issue a new access token using the refresh token cookie. |
| GET | `/me` | CUSTOMER, TECHNICIAN, ADMIN | — | Get current authenticated user profile. |

### Public — services, technicians, categories

| Method | Path | Auth | Query | Description |
|---|---|---|---|---|
| GET | `/api/services` | Public | `search`, `type`, `location`, `minPrice`, `maxPrice`, `page`, `limit` | List services with optional filters. |
| GET | `/api/technicians` | Public | `skills`, `minExperience`, `maxExperience`, `page`, `limit` | List technicians with optional filters. |
| GET | `/api/technicians/:technicianId` | Public | — | Get a technician's public profile and reviews. |
| GET | `/api/categories` | Public | `page`, `limit` | List service categories. |

### Customer — `/api/users`

| Method | Path | Auth | Body | Description |
|---|---|---|---|---|
| GET | `/profile` | CUSTOMER | — | Get own profile. |
| PUT | `/profile` | CUSTOMER | `{ firstName?, lastName?, phone?, address?, city?, profileImage?, bio?, skills?, experience?, hourlyRate?, availability? }` | Update own profile. Technicians may also update technician fields. |
| PATCH | `/change-password` | CUSTOMER | `{ oldPassword, newPassword }` | Change password. |
| DELETE | `/delete` | CUSTOMER | — | Delete own account. |

### Bookings — `/api/bookings`

| Method | Path | Auth | Body | Description |
|---|---|---|---|---|
| POST | `/` | CUSTOMER | `{ serviceId, scheduledDate, address, note? }` | Create a new booking (status `REQUESTED`). |
| GET | `/` | CUSTOMER | — | List the customer's own bookings. |
| GET | `/status` | CUSTOMER | — | Get the customer's bookings (same handler as `GET /`). |
| GET | `/:bookingId` | CUSTOMER | — | Get details for a single booking. |
| PATCH | `/cancel/:bookingId` | CUSTOMER | `{ cancelReason? }` | Cancel a booking. Current implementation allows cancellation only when booking status is `IN_PROGRESS`. |

### Payments — `/api/payments`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/create` | CUSTOMER | Create a Stripe Checkout session for an accepted booking; returns the payment URL. |
| POST | `/webhook` | Stripe webhook | Stripe webhook endpoint. Expects raw body plus `stripe-signature` header. On `checkout.session.completed`, payment is fulfilled and booking status updates to `IN_PROGRESS`. |
| GET | `/history` | CUSTOMER | Get the customer's payment history. |
| GET | `/:paymentId` | CUSTOMER | Get a single payment's details. |

### Reviews — `/api/reviews`

| Method | Path | Auth | Body | Description |
|---|---|---|---|---|
| POST | `/` | CUSTOMER | `{ bookingId, rating, comment? }` | Create a review for a completed booking. |

### Technician — `/api/technicians`

| Method | Path | Auth | Body | Description |
|---|---|---|---|---|
| GET | `/profile` | TECHNICIAN | — | Get own technician profile. |
| PUT | `/profile` | TECHNICIAN | `{ bio?, skills?, experience?, hourlyRate?, availability? }` | Update own technician profile. |
| PATCH | `/change-password` | TECHNICIAN | `{ oldPassword, newPassword }` | Change password. |
| PATCH | `/availability` | TECHNICIAN | `{ availability: string[] }` | Update availability slots. |
| GET | `/bookings` | TECHNICIAN | — | List bookings assigned to the technician. |
| GET | `/bookings/incomming` | TECHNICIAN | — | List incoming `REQUESTED` bookings. |
| GET | `/bookings/:bookingId` | TECHNICIAN | — | Get a booking's details. |
| PATCH | `/bookings/:bookingId` | TECHNICIAN | `{ status: "ACCEPTED" \| "DECLINED" \| "COMPLETED" }` | Accept, decline, or complete a booking. |
| GET | `/:technicianId` | Public | — | Get a technician's public profile. |

### Services — `/api/services`

| Method | Path | Auth | Body | Description |
|---|---|---|---|---|
| POST | `/` | TECHNICIAN | `{ categoryId, title, description, price, duration, location[], availableAt[] }` | Create a service listing. `type` is inferred from the category. |
| GET | `/` | Public | `search`, `type`, `location`, `minPrice`, `maxPrice`, `page`, `limit` | List services. |
| PUT | `/:serviceId` | TECHNICIAN | Any subset of the create body | Update own service listing (ownership enforced). |

### Admin — `/api/admin`

| Method | Path | Auth | Body | Description |
|---|---|---|---|---|
| GET | `/profile` | ADMIN | — | Get admin profile. |
| PUT | `/profile` | ADMIN | `{ firstName?, lastName?, phone? }` | Update admin profile. |
| PATCH | `/change-password` | ADMIN | `{ oldPassword, newPassword }` | Change password. |
| GET | `/users` | ADMIN | — | List customers and technicians. |
| PATCH | `/users/update-status/:userId` | ADMIN | `{ status: "ACTIVE" \| "BLOCKED" }` | Update user status. |
| GET | `/bookings` | ADMIN | — | List all bookings. |
| GET | `/bookings/:bookingId` | ADMIN | — | Get a booking's details. |
| GET | `/categories` | Public | — | List all categories. |
| POST | `/categories` | ADMIN | `{ name, icon?, description? }` | Create a category. |
| PATCH | `/categories/:categoryId` | ADMIN | `{ name?, icon?, description? }` | Update a category. |
| GET | `/payment-history` | ADMIN | — | View payment history platform-wide. |


---

## Database schema

Prisma models on PostgreSQL:

| Model | Purpose |
|---|---|
| `User` | Account details, role (`CUSTOMER`/`TECHNICIAN`/`ADMIN`), and status |
| `TechnicianProfile` | Bio, skills, experience, hourly rate, availability, completed jobs |
| `Services` | Individual services offered by a technician, linked to a category |
| `Category` | Service categories (plumbing, electrical, cleaning, etc.) |
| `Booking` | A job request between a customer and technician, with lifecycle status |
| `Payment` | Stripe transaction records linked one-to-one with a booking |
| `Review` | Customer ratings and feedback tied to a service, technician, and customer |

---

## License

MIT

## Author

**Md. Shahdat Hossain**

