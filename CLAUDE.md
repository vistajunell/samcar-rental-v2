# CLAUDE.md — SamCar Rental V2

## Role

You are a senior full-stack developer, product architect, UI/UX designer, and SaaS dashboard builder.

You are rebuilding SamCar Rental into **SamCar Rental V2**.

## Absolute Requirement

Preserve the old SamCar design style.

The old project already has a strong design system using:

```txt
Next.js 16.2.4
React 19.2.4
Tailwind CSS v4
Geist font
Class-based dark mode
Brand Red #f41918
Deep Red #c71926
Header/Footer/ThemeProvider layout
HeroSection
FeaturedCars
HowItWorks
WhyChooseUs
ContactSection
shine-btn effect
glow-red effect
```

Do not replace the brand with a generic blue SaaS theme.

## Business Model

SamCar is commission-based.

The company owner does not necessarily own the vehicles.

The admin confirms availability from partner car owners first. Only after confirmation does the admin publish the car publicly.

## Old Flow to Remove

Remove the public calendar availability flow.

Do not build public real-time date conflict checking as the main customer experience.

Remove or replace:

```txt
Availability page as main flow
AvailabilityBar live date checker
Pick-up Date / Return Date public availability search
Live Availability
Check Availability
```

## New Flow

Use this flow:

```txt
Partner car owner confirms vehicle availability
↓
Admin publishes confirmed car
↓
Customer browses available cars
↓
Customer submits booking request form
↓
Admin verifies booking and documents
↓
Admin approves/rejects booking
↓
Admin sends SMS/email
↓
Admin generates invoice/receipt
↓
Payment is tracked
```

## Public Website

Use the old design sections but update logic:

```txt
HeroSection
ConfirmedCarsBar or BookingRequestBar
FeaturedCars / AvailableCars
HowItWorks
WhyChooseUs
ContactSection
Footer
```

Public routes:

```txt
/
 /cars
/cars/[slug]
/book
/booking-success
/contact
```

Navigation:

```txt
Home
Cars
About
How it Works
Booking
Contact
```

Remove:

```txt
Availability
```

## Header Requirements

Follow the old Header style:

```txt
Fixed top header
Logo left
Desktop navigation center
ThemeToggle and CTA on right
Mobile hamburger
White/transparent light mode
Black/transparent dark mode
Red hover underline
Book Now shine button
```

Use logo:

```txt
/images/logo/samcar-logo.webp
```

## Theme Requirements

Use the old class-based dark mode system.

Theme storage key in old project:

```txt
theme
```

Values:

```txt
light
dark
```

Default in old project:

```txt
dark
```

Keep compatibility with old ThemeProvider unless intentionally changed.

## CSS Requirements

Use Tailwind CSS v4 with `@theme`.

Required CSS tokens:

```css
@custom-variant dark (&:where(.dark, .dark *));

:root {
  --background: #ffffff;
  --foreground: #0a0a0a;
  --card-bg: #ffffff;
  --section-bg: #f7f7f7;
  --body-text: #333333;
  --border: #e5e7eb;
}

.dark {
  --background: #050505;
  --foreground: #ffffff;
  --card-bg: #111111;
  --section-bg: #0a0a0a;
  --body-text: #d1d1d1;
  --border: rgba(255, 255, 255, 0.08);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card-bg);
  --color-section: var(--section-bg);
  --color-body: var(--body-text);
  --font-sans: var(--font-geist-sans);
}

@theme {
  --color-brand-red: #f41918;
  --color-deep-red: #c71926;
}
```

Keep:

```txt
shine-btn
glow-red
animate-pulse-glow
no-scrollbar
booking-day-picker styling if react-day-picker is still used internally
```

## Booking Form

The customer booking form must follow the old Jotform-style business process.

Fields:

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

Initial booking status:

```txt
PENDING_VERIFICATION
```

## Admin Dashboard

Build a new management dashboard, but use SamCar brand colors.

Admin modules:

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

Admin must support:

```txt
Add booking manually
View booking
Approve booking
Reject booking
Mark paid/unpaid/partial
Generate invoice
Print receipt
Send SMS
Send email
Manage partner car owners
Publish/unpublish cars
Upload car images
Track customers
Track payments
Prepare GPS tracking
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

Customer verification:

```txt
UNVERIFIED
PENDING_REVIEW
VERIFIED
BLACKLISTED
```

## Coding Rules

- Use TypeScript.
- Use Next.js App Router.
- Use Tailwind v4 syntax.
- Use Prisma.
- Use Zod validation.
- Use server-side validation.
- Protect admin routes.
- Do not expose private uploaded customer documents.
- Use environment variables for all secrets.
- Do not hardcode API keys.
- Use responsive design.
- Keep mobile layout clean.
- Use old SamCar components as visual references.
- Preserve old brand identity.

## Output Rules

When coding:

1. List files to create/change.
2. Provide complete code.
3. Include install commands if needed.
4. Include Prisma schema changes if needed.
5. Include migration commands if needed.
6. Include `.env.example` updates if needed.
7. Include test steps.
