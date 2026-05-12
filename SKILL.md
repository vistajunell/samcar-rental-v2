---
name: samcar-rental-v2-builder
description: Use this skill when building, redesigning, migrating, or debugging SamCar Rental V2. The project must preserve the old SamCar visual design while rebuilding the system as a commission-based rental management platform with partner-confirmed cars, booking requests, admin approval, payments, invoices, SMS/email, and GPS tracking preparation.
---

# SamCar Rental V2 Builder Skill

## Use This Skill When

The task is about:

```txt
SamCar Rental V2
Old SamCar design preservation
Landing page
Theme switch
Brand colors
Booking form
Admin dashboard
Cars management
Partners
Customers
Payments
Invoices
SMS/email
GPS tracking
Prisma schema
Next.js 16 App Router
Tailwind v4
Vercel deployment
```

## Core Instruction

Preserve the old SamCar design.

Do not make a generic blue SaaS system.

Use:

```txt
Brand Red #f41918
Deep Red #c71926
Dark/light mode
Geist font
Logo /images/logo/samcar-logo.webp
Car images /images/cars
mobile-hero-section-bg.png
shine-btn
glow-red
rounded premium cards
```

## Business Logic

SamCar is a commission-based rental business.

Flow:

```txt
Admin contacts partner car owner
↓
Partner confirms availability
↓
Admin publishes car
↓
Customer submits booking request
↓
Admin verifies documents
↓
Admin approves/rejects
↓
Admin sends SMS/email
↓
Admin generates invoice/receipt
↓
Payment is tracked
```

## Remove Old Flow

Do not keep public calendar-first availability.

Remove or replace:

```txt
AvailabilityBar
Live Availability
Pick-up Date / Return Date public availability checker
/availability as main customer flow
```

## New Public Flow

Public pages:

```txt
/
 /cars
/cars/[slug]
/book
/booking-success
/contact
```

Homepage sections:

```txt
HeroSection
BookingRequestBar
FeaturedCars / AvailableCars
HowItWorks
WhyChooseUs
ContactSection
Footer
```

## Required Booking Fields

```txt
Full Name
Contact Number
Email
Full Residential Address
Start Rental Date and Time
End Rental Date and Time
Purpose of Rental
Destination
Car Rental with Driver? Yes/No
Type of Car
Number of Passengers
Pickup Address
Drop-off Address
Facebook Account Name
Notes / Special Request
Government ID 1 Upload
Government ID 2 Upload
Selfie Holding Valid ID Upload
Recent Proof of Billing Upload
```

## Statuses

Booking:

```txt
PENDING_VERIFICATION
UNDER_REVIEW
APPROVED
REJECTED
CANCELLED
COMPLETED
```

Payment:

```txt
UNPAID
PARTIALLY_PAID
PAID
REFUNDED
```

Car:

```txt
DRAFT
CONFIRMED_AVAILABLE
PUBLISHED
UNAVAILABLE
ARCHIVED
```

## Stack

Use old project stack:

```txt
Next.js 16.2.4
React 19.2.4
TypeScript
Tailwind CSS v4
Prisma 7.8
PostgreSQL
Framer Motion
Lucide React
Zod
Jose
bcryptjs
Resend
Cloudinary or UploadThing
Vercel
```

## CSS Requirements

Use Tailwind v4.

Required tokens:

```txt
@custom-variant dark (&:where(.dark, .dark *))
--color-brand-red: #f41918
--color-deep-red: #c71926
--color-background
--color-foreground
--color-card
--color-section
--color-body
```

Keep utilities:

```txt
shine-btn
glow-red
animate-pulse-glow
no-scrollbar
```

## Admin Modules

```txt
Dashboard
Bookings
Cars
Partners
Customers
Payments
Invoices
GPS Tracking
Notifications
Settings
```

## Security

Protect:

```txt
Government IDs
Selfie with ID
Proof of billing
Payment proof
Partner private contact details
Admin notes
GPS private data
```

Rules:

```txt
Protect admin routes
Validate all inputs
Use env variables
Do not hardcode secrets
Do not expose private documents publicly
Do not log sensitive customer data
```

## Output Format

When asked to code:

1. State files to create/change.
2. Provide complete code.
3. Include install commands if needed.
4. Include Prisma/schema changes if needed.
5. Include migration commands.
6. Include `.env.example` updates.
7. Include test steps.
