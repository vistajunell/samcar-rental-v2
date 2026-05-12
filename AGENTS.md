# AGENTS.md — SamCar Rental V2 Agent Rules

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This project uses Next.js 16.x style assumptions. Read the installed Next.js docs in `node_modules/next/dist/docs/` before changing framework-level code. APIs such as `cookies()`, `headers()`, `params`, and `searchParams` may be async. Use `proxy.ts` if middleware behavior is required by this version.
<!-- END:nextjs-agent-rules -->

## Project Mission

Rebuild SamCar Rental as V2 while preserving the old SamCar design.

The system must become a commission-based rental car management platform where the admin publishes partner-confirmed available cars.

## Global Rules

- Preserve the old design language.
- Keep SamCar red branding.
- Keep dark/light mode.
- Keep premium automotive UI.
- Remove the public calendar availability flow.
- Replace public availability checking with admin-confirmed published cars.
- Build a dashboard for real rental management.
- Do not overwrite the old project or old database.
- Use a new repository and new Vercel project.

## Agent 1 — Product Architect

Responsibilities:

```txt
Business logic
System flow
Feature scope
Data model
Phase planning
```

Rules:

```txt
SamCar is commission-based
Cars can belong to partners
Public cars are admin-confirmed
Final booking approval is manual
Admin dashboard is the source of truth
```

Avoid:

```txt
Treating SamCar as full fleet owner only
Public calendar-first UX
Automatic approval without admin verification
```

## Agent 2 — UI/UX Designer

Responsibilities:

```txt
Landing page
Public booking form
Dashboard design
Mobile responsiveness
Theme consistency
```

Rules:

```txt
Follow old SamCar design
Use brand red #f41918
Use deep red #c71926
Use class-based dark mode
Use old Header/Footer style
Use old hero/car-card visual direction
Use shine button effects
Use red glows carefully
```

Avoid:

```txt
Generic blue SaaS theme
Huge side margins
Compressed nav
Overly plain admin tables
Removing theme switch
```

## Agent 3 — Frontend Developer

Responsibilities:

```txt
Next.js App Router
React components
Tailwind v4
ThemeProvider
Header/Footer
Forms
Responsive UI
```

Rules:

```txt
Use TypeScript
Use reusable components
Use old component style as reference
Use /public/images assets
Use next/image
Avoid hydration mismatch in theme toggle
Use accessible buttons/forms
```

## Agent 4 — Backend Developer

Responsibilities:

```txt
Prisma schema
Server Actions/API routes
Auth
Booking CRUD
Car CRUD
Partner CRUD
Payment CRUD
Invoice generation
Notifications
```

Rules:

```txt
Validate with Zod
Never trust client input
Protect admin routes
Do not expose uploaded IDs publicly
Use environment variables
Keep database logic separate from UI
```

## Agent 5 — Database Architect

Responsibilities:

```txt
Prisma schema
Relationships
Enums
Indexes
Data safety
Migration planning
```

Required entities:

```txt
User
Customer
Partner
Car
CarImage
CarAvailability
Booking
BookingDocument
Payment
Invoice
NotificationLog
GpsDevice
GpsLocation
AuditLog
```

## Agent 6 — Automation Agent

Responsibilities:

```txt
Resend email
SMS provider integration
Payment reminders
Booking approval messages
Invoice sending
Notification logs
```

Rules:

```txt
Log every email/SMS
Use manual trigger buttons first
Avoid surprise auto-SMS unless clearly requested
Store provider result/error
```

## Agent 7 — QA/Security Agent

Responsibilities:

```txt
Test booking form
Test admin protection
Test file upload privacy
Test status changes
Test invoice generation
Test SMS/email logs
Test mobile layout
```

Security rules:

```txt
Protect government IDs
Protect selfie with ID
Protect proof of billing
Protect payment proof
Do not log sensitive data
Do not expose private URLs publicly
```

## Branches

Recommended:

```txt
main
develop
phase-1-public-booking
phase-2-admin-dashboard
phase-3-automation
phase-4-invoice
phase-5-gps
```

## Definition of Done

A feature is done only when:

```txt
It matches SamCar design
It works in light and dark mode
It works on mobile
It validates data
It handles empty/loading/error states
It does not expose secrets
It protects admin-only functions
It has testing steps
```
