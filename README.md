# Tailor Link API

Tailor Link is an API for connecting customers with tailors, managing bookings, escrow payments, delivery tracking, reviews, disputes, and KYC. This repository implements the backend services using Node.js (Express) and Sequelize.

## Features

- Authentication with JWT and role-based access
- Tailor profiles, pricing plans, public search
- Gallery: tailors upload images; customers view tailor galleries
- Bookings with status transitions and escrow (provider stubs)
- Delivery tracking with email notifications
- Reviews with admin moderation
- Disputes management for bookings
- Admin dashboard: stats, users, escrow management
- Site settings: KYC requirements CRUD

## Getting Started

### Requirements

- Node.js 18+
- PostgreSQL (or compatible database)

### Environment

Create `.env` based on `.env.example` with database connection and optional SMTP settings.

### Install & Run

```
npm install
npm run dev
```

Server runs at `http://localhost:4000` by default.

## API Base

- Base path: `http://localhost:4000/api`
- Swagger docs: `http://localhost:4000/api/docs`

## Authentication

- Bearer JWT via `Authorization: Bearer <token>` header
- Most admin and user endpoints require authentication

## Key Endpoints

- Public tailor profile: `GET /tailors/{userId}/profile`
- Public tailor plans: `GET /tailors/{userId}/plans`
- Public tailor gallery: `GET /tailors/{userId}/gallery`
- Tailor upload gallery image: `POST /tailors/me/gallery` (multipart field `image`)
- Mutual user profile: `GET /users/{userId}/profile`
- My bookings list: `GET /bookings/mine?status=&from=&to=&page=&limit=`
- Admin stats: `GET /admin/stats`
- Admin users: `GET /admin/users`
- Admin user status: `PATCH /admin/users/{userId}/status` with `{ status: 'active'|'suspended' }`
- Admin user role: `PATCH /admin/users/{userId}/role` with `{ role: 'customer'|'tailor'|'admin' }`
- Admin KYC requirements: `GET|POST|PATCH|DELETE /admin/settings/kyc`
- Admin tailor detail: `GET /admin/tailors/{userId}`
- Admin download KYC: `GET /admin/tailors/{userId}/kyc/{docId}/download`
- Admin escrow list/release/refund: `GET /admin/escrow`, `POST /admin/escrow/{txId}/release`, `POST /admin/escrow/{txId}/refund`
- Disputes: customer/tailor `POST /bookings/{bookingId}/disputes`, `GET /me/disputes` ; admin `GET /admin/disputes`, `POST /admin/disputes/{disputeId}/resolve`, `POST /admin/disputes/{disputeId}/reject`
- Reviews: `POST /bookings/{bookingId}/reviews`, `GET /tailors/{tailorId}/reviews`

## Gallery File Serving

- Uploaded images are stored under `storage/gallery/{userId}`
- Public URLs for images are served at `/api/gallery/{userId}/{filename}`

## SMTP Emails (Optional)

- Delivery initiation and status update emails use SMTP if configured

## Notes

- Payment provider integrations (`Flutterwave`, `Paga`) are stubs; connect real APIs before production
- Ensure file upload limits and validation match your needs
- Consider adding rate limiting and comprehensive audit logging for admin actions

## License

Proprietary — do not distribute without permission.