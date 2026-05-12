# SamCar Rental V2 Progress

Last updated: 2026-05-13

## Current Phase

```txt
Phase 4 - Documents, invoices, and communications are in progress.
```

The project is deployed and usable on Vercel. Public booking works, Neon/PostgreSQL is connected, admin login works, and the admin dashboard can view real database records.

## Phase Status

| Phase | Status | Notes |
| --- | --- | --- |
| Phase 0 - Safe Setup | Complete | New repo, new Vercel project, new Neon database, environment variables, GitHub push, production deploy. |
| Phase 1 - Public Flow | Complete | Old SamCar visual direction preserved, public cars, car details, booking form, booking success page, dark/light mode. |
| Phase 2 - Database and Auth | Complete core | Prisma schema, Neon database, seed data, custom admin login, JWT cookie sessions, protected admin routes. |
| Phase 3 - Admin Dashboard Core | Complete core | Admin layout, dashboard, list/detail pages, and booking status actions exist. Full CRUD workflows are still pending. |
| Phase 3.5 - Admin Hardening | Complete core | Admin login human check, password change, booking, car inventory, partner management, customer review, and dashboard performance polish are added. |
| Phase 4 - Documents, Invoice, Email, SMS | In progress | Invoice generation from approved/completed bookings is added; private uploads, PDF download, email, SMS, and notification sending remain. |
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
- Admin can create and edit cars with partner assignment, price, specs, browsed/compressed image, status, and availability window.
- Admin can publish, unpublish, mark unavailable, and archive cars.
- Public and admin car image cards support both existing image paths and browsed database-backed images.
- Admin can create and edit partner owners with contact details, commission rate, and internal notes.
- Partner detail pages now show full admin inventory, including hidden and draft cars.
- Admin can update customer verification status and internal review notes.
- Blacklisted customers are blocked from public booking submission and admin booking approval.
- Dashboard/admin queries now use short-lived tagged caching with mutation invalidation.
- Admin cars page no longer performs per-car partner lookups.
- Customer and dashboard totals now use database aggregation instead of loading all rows into memory.
- Protected admin panel routes are explicitly runtime-dynamic to avoid build-time dashboard database work.
- Admin can generate an invoice from an approved or completed booking.
- Booking detail shows the linked invoice once generated.
- Recorded payments now sync an existing invoice's paid amount, balance, and payment status.

## In Progress

- Phase 3.5 admin hardening and management features.
- Turning read-only admin tables into real create/edit/update workflows.
- Booking management hardening: status transitions, notes, and payment recording.
- Phase 4 document, invoice, and communication features.
- Replacing mock document URLs with private upload storage.
- Hardening production admin credentials beyond seeded demo accounts.

## Next Priority

1. Add real admin user/password management so seeded demo credentials are no longer used.
2. Add printable/PDF invoice output.
3. Add private Cloudinary upload flow for customer documents and payment proofs.
4. Add notification actions for manual email/SMS sending with `NotificationLog` records.
5. Review admin read-only pages for payments and notifications.

## Known Gaps

- Seeded admin credentials still exist and should be replaced before real customer use.
- Booking documents currently store mock URLs and metadata only.
- Admin payments, invoices, and notifications are mostly read-only.
- Browsed admin car images are temporarily stored as compressed data URLs until Cloudinary/upload storage is wired.
- Invoice creation is wired; printable/PDF invoice download is not wired yet.
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
