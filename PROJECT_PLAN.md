# PROJECT_PLAN.md — SamCar Rental V2 Build Plan

## Goal

Rebuild SamCar Rental using the old design but new system logic.

## Existing Old Website Sections

Old home structure:

```tsx
<HeroSection cars={cars} />
<AvailabilityBar />
<FeaturedCars cars={cars.slice(0, 6)} />
<HowItWorks />
<WhyChooseUs />
<ContactSection />
```

V2 home structure:

```tsx
<HeroSection cars={cars} />
<BookingRequestBar />
<FeaturedCars cars={cars.slice(0, 6)} />
<HowItWorks />
<WhyChooseUs />
<ContactSection />
```

or:

```tsx
<HeroSection cars={cars} />
<ConfirmedCarsBar />
<AvailableCars cars={cars.slice(0, 6)} />
<HowItWorks />
<WhyChooseUs />
<ContactSection />
```

## Phase 0 — Safe Setup

Tasks:

```txt
Create new GitHub repo: samcar-rental-v2
Create new local folder
Copy old design assets
Copy old CSS theme tokens
Copy Header/Footer/ThemeProvider style
Create new database
Create new Vercel project
Do not overwrite old repo
```

Commands:

```bash
cd D:\Development\Website
npx create-next-app@latest samcar-rental-v2
cd samcar-rental-v2
```

Recommended create-next-app choices:

```txt
TypeScript: Yes
ESLint: Yes
Tailwind CSS: Yes
App Router: Yes
Turbopack: Yes
Import alias: Yes
```

Install old stack:

```bash
npm install @prisma/adapter-pg @prisma/client bcryptjs clsx date-fns framer-motion jose lucide-react pg prisma react-day-picker server-only tailwind-merge zod
npm install -D @tailwindcss/postcss @types/bcryptjs @types/node @types/pg @types/react @types/react-dom dotenv eslint eslint-config-next tailwindcss tsx typescript
```

Additional V2 integrations:

```bash
npm install resend
npm install cloudinary
npm install @react-pdf/renderer
```

## Phase 1 — Preserve Design + New Public Flow

Build:

```txt
Old-style Header
Old-style Footer
ThemeProvider
ThemeToggle
HeroSection
CarShowcaseCard
BookingRequestBar replacing AvailabilityBar
FeaturedCars using published cars
HowItWorks with new copy
WhyChooseUs with new copy
ContactSection
Booking form page
Booking success page
```

Remove/replace:

```txt
AvailabilityBar public real-time date checker
/availability main navigation
Public conflict calendar as main flow
```

Acceptance criteria:

```txt
Website looks like old SamCar
Theme switch works
Logo and car images load
Homepage has new V2 copy
Booking form saves request
Only published cars appear publicly
```

## Phase 2 — Database and Auth

Build:

```txt
Prisma schema V2
Custom admin auth
JWT httpOnly cookie
Admin route protection
Seed admin user
Seed sample cars using /public/images/cars
```

Acceptance criteria:

```txt
Admin can log in
Protected admin routes redirect when not logged in
Database models support partner-owned cars
Bookings support document fields and status workflow
```

## Phase 3 — Admin Dashboard Core

Build:

```txt
Admin layout
Sidebar
Topbar with ThemeToggle
Dashboard overview
Bookings CRUD
Cars CRUD
Partners CRUD
Customers CRUD
Payments CRUD
```

Acceptance criteria:

```txt
Admin can publish/unpublish cars
Admin can approve/reject bookings
Admin can assign car to booking
Admin can manage partners
Admin can manage customers
Admin can update payment status
```

## Phase 4 — Documents, Invoice, Email, SMS

Build:

```txt
Private document uploads
Invoice generator
Printable receipt
PDF invoice
Resend email integration
SMS provider integration
Notification logs
Payment reminder actions
```

Acceptance criteria:

```txt
Admin can view booking documents
Admin can generate invoice
Admin can print/download receipt
Admin can send SMS/email
Notification status is logged
```

## Phase 5 — GPS Tracking

Build:

```txt
GPS page
GPS device records
Assign device to car
Map placeholder
Provider integration preparation
```

Acceptance criteria:

```txt
Admin can register GPS device
Admin can assign device to vehicle
Data model is ready for provider API
```

## Deployment Plan

Use new Vercel project:

```txt
samcar-rental-v2.vercel.app
```

Do not connect V2 to the old production project until approved.

## Branch Workflow

```txt
main
develop
phase-1-public-flow
phase-2-auth-db
phase-3-admin-dashboard
phase-4-automation-invoice
phase-5-gps
```
