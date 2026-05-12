# SamCar Rental V2 — Commission-Based Rental Management System

## Project Purpose

SamCar Rental V2 is a complete rebuild of the existing SamCar Rental website.

The goal is to **preserve the old SamCar visual design** while changing the system logic into a more accurate business workflow.

The old website was closer to a normal car rental booking website with availability checking.

The new V2 system is a **commission-based rental management system**.

SamCar does not always own the vehicles. The admin contacts trusted partner car owners first. If a partner confirms that a vehicle is available for a specific date range, the admin publishes that vehicle to the public website.

## Core Business Flow

```txt
Customer needs a rental car
↓
SamCar admin contacts partner car owners
↓
Partner confirms available vehicle and dates
↓
Admin adds/publishes car in dashboard
↓
Public visitor sees confirmed available car
↓
Customer submits booking form
↓
Admin verifies details and documents
↓
Admin approves or rejects booking
↓
System sends email/SMS
↓
Invoice or receipt is generated
↓
Payment is tracked
↓
Booking is completed
```

## Important Design Rule

Use the **old SamCar website design** as the main visual reference.

Do not redesign this into a generic blue SaaS dashboard.

Keep:

```txt
SamCar red branding
Dark/light mode switch
Premium car rental look
Hero section with car showcase
Featured cars section
How it works section
Why choose us section
Contact section
Logo usage
Car image assets
Shine button effect
Red glow effect
Rounded premium cards
```

Change:

```txt
Remove public calendar availability flow
Remove live availability checker
Replace old booking logic with form-based booking request
Add admin dashboard management flow
Add partner car owner management
Add invoice, SMS, email, payments, GPS planning
```

## Repository Name

Recommended:

```txt
samcar-rental-v2
```

Do not name this `samcar-rental-1.0.1` because this is a major rebuild.

Use releases instead:

```txt
v1.0.0 = old SamCar system
v2.0.0 = rebuilt management system
```

## Locked Visual Identity

Brand colors:

```txt
Brand Red: #f41918
Deep Red: #c71926
```

Theme tokens from the old project:

```txt
Light background: #ffffff
Light foreground: #0a0a0a
Light section: #f7f7f7
Dark background: #050505
Dark foreground: #ffffff
Dark card: #111111
Dark section: #0a0a0a
```

## Local Asset Paths

Use these assets:

```txt
D:\Development\Website\samcar-rental-v2\public\images
D:\Development\Website\samcar-rental-v2\public\images\cars
D:\Development\Website\samcar-rental-v2\public\images\logo\samcar-logo.webp
D:\Development\Website\samcar-rental-v2\public\images\mobile-hero-section-bg.png
```

Next.js public references:

```txt
/images/logo/samcar-logo.webp
/images/mobile-hero-section-bg.png
/images/cars/[filename].webp
```

## Recommended Stack

Match the old project stack:

```txt
Next.js 16.2.4
React 19.2.4
TypeScript 5
Tailwind CSS v4
Prisma 7.8
PostgreSQL / Neon
Framer Motion
Lucide React
Zod
Jose + bcryptjs for custom JWT auth
Resend for email
Semaphore PH or Twilio for SMS
Cloudinary or UploadThing for uploads
Vercel deployment
GitHub version control
```

## Main Modules

Public:

```txt
/
 /cars
/cars/[slug]
/book
/booking-success
/contact
```

Admin:

```txt
/admin/login
/admin/dashboard
/admin/bookings
/admin/bookings/[id]
/admin/cars
/admin/partners
/admin/customers
/admin/payments
/admin/invoices
/admin/gps
/admin/notifications
/admin/settings
```

## First Build Priority

Phase 1:

```txt
Preserve old landing page design
Replace AvailabilityBar with BookingRequestBar or ConfirmedCarsBar
Build public booking form
Keep old header/footer/theme toggle style
Setup V2 database schema
```

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in at least:

```env
DATABASE_URL=""
AUTH_SECRET=""
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

3. Prepare the database and seed demo data:

```bash
npm run db:push
npm run db:seed
```

4. Start development:

```bash
npm run dev
```

## Deployment

Use [DEPLOYMENT.md](./DEPLOYMENT.md) for the full GitHub + Vercel deployment runbook.

Important deployment notes:

```txt
This project needs DATABASE_URL during next build
The first deployment should use prisma db push because there is no migrations folder yet
Demo admin credentials come from prisma/seed.ts and should be replaced in real deployments
```
