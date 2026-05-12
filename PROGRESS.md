# SamCar Rental V2 Progress

Last updated: 2026-05-12

## Current Phase

```txt
Phase 3.5 - Admin hardening and management workflows are in progress.
```

The project is deployed and usable on Vercel. Public booking works, Neon/PostgreSQL is connected, admin login works, and the admin dashboard can view real database records.

## Phase Status

| Phase | Status | Notes |
| --- | --- | --- |
| Phase 0 - Safe Setup | Complete | New repo, new Vercel project, new Neon database, environment variables, GitHub push, production deploy. |
| Phase 1 - Public Flow | Complete | Old SamCar visual direction preserved, public cars, car details, booking form, booking success page, dark/light mode. |
| Phase 2 - Database and Auth | Complete core | Prisma schema, Neon database, seed data, custom admin login, JWT cookie sessions, protected admin routes. |
| Phase 3 - Admin Dashboard Core | Complete core | Admin layout, dashboard, list/detail pages, and booking status actions exist. Full CRUD workflows are still pending. |
| Phase 3.5 - Admin Hardening | In progress | Admin login human check and password change flow are added; CRUD and management hardening remain before Phase 4. |
| Phase 4 - Documents, Invoice, Email, SMS | Not started | Schemas and seeded mock data exist, but real private uploads, PDF generation, email, SMS, and notification sending are pending. |
| Phase 5 - GPS Tracking | Not started | Data model and placeholder admin page exist, but provider integration and live tracking are pending. |

## Completed

- GitHub repository initialized and pushed.
- Vercel production deployment is live.
- Neon/PostgreSQL database is connected.
- Prisma Client generation runs during build.
- Public homepage loads with SamCar branding.
- Public `/cars` and `/cars/[slug]` load from database.
- Public `/book` submits booking requests to database.
- `/booking-success` confirms submitted requests.
- Admin `/admin/login` works on production.
- Admin protected routes require a valid session.
- Admin login includes a signed human verification challenge.
- Signed-in admins can change their own password from settings.
- Admin dashboard reads real database stats.
- Admin bookings page reads submitted bookings.
- Admin booking detail page displays customer, car, document metadata, payment rows, and status actions.
- Booking actions support approve, mark under review, reject, cancel, and complete.
- Booking detail supports editable internal admin notes.
- Booking detail supports recording payments and automatically updates booking payment status.
- Admin cars list now shows full inventory, including draft, hidden, unavailable, and archived units.
- Admin can create and edit cars with partner assignment, price, specs, image path, status, and availability window.
- Admin can publish, unpublish, mark unavailable, and archive cars.

## In Progress

- Phase 3.5 admin hardening and management features.
- Turning read-only admin tables into real create/edit/update workflows.
- Booking management hardening: status transitions, notes, and payment recording.
- Inventory management hardening: car create/edit, visibility actions, partner assignment, and availability windows.
- Replacing mock document URLs with private upload storage.
- Hardening production admin credentials beyond seeded demo accounts.

## Next Priority

1. Add real admin user/password management so seeded demo credentials are no longer used.
2. Add partner management forms: create/edit partners and commission notes.
3. Add invoice generation trigger for approved or paid bookings.
4. Add private Cloudinary upload flow for customer documents and payment proofs.
5. Add notification actions for manual email/SMS sending with `NotificationLog` records.

## Known Gaps

- Seeded admin credentials still exist and should be replaced before real customer use.
- Booking documents currently store mock URLs and metadata only.
- Admin cars, partners, customers, payments, invoices, and notifications are mostly read-only.
- Invoice PDF generation is not wired yet.
- Email/SMS providers are not configured or sending yet.
- GPS is a placeholder module.
- There are no automated tests yet.

## Production Smoke Test

Verified manually:

```txt
/ loads
/cars loads
/book submits booking
/booking-success loads
/admin/login works
/admin/dashboard loads after login
```
