# PROMPTS.md — SamCar Rental V2 Claude/Codex Prompts

## Important Usage Note

You are working inside the new project folder:

```txt
D:\Development\Website\samcar-rental-v2
```

The old SamCar design files and assets have already been copied into this new project.

Use these copied files as the **main visual/design reference**:

```txt
app/globals.css
app/layout.tsx
app/page.tsx
components/
public/images/
public/images/cars/
public/images/logo/samcar-logo.webp
public/images/mobile-hero-section-bg.png
```

Preserve the existing SamCar visual design, brand colors, dark/light mode, header, footer, hero section, car cards, layout style, and premium rental branding.

Only change the **system flow and business logic** for SamCar Rental V2.

Do not create a new generic design from scratch.

---

## Prompt 1 — Inspect Copied Old SamCar Design and Plan V2

```txt
You are a senior full-stack developer and UI/UX designer.

I created a new project folder:

D:\Development\Website\samcar-rental-v2

I already copied the old SamCar design files and assets into this new project.

Inspect these files first:
- app/globals.css
- app/layout.tsx
- app/page.tsx
- components/
- public/images/
- public/images/cars/
- public/images/logo/samcar-logo.webp
- public/images/mobile-hero-section-bg.png

Use them as the source of truth for the visual design.

Do not create a new visual design from scratch.

Preserve:
- Brand Red #f41918
- Deep Red #c71926
- Tailwind CSS v4 @theme tokens
- class-based dark mode
- light/dark mode switch
- ThemeToggle
- shine-btn effect
- glow-red effect
- old-style Header/Footer layout
- old-style HeroSection
- old-style FeaturedCars
- old-style HowItWorks
- old-style WhyChooseUs
- old-style ContactSection
- old car card style
- logo path /images/logo/samcar-logo.webp
- car images path /images/cars
- mobile hero image path /images/mobile-hero-section-bg.png

System goal:
Convert this into SamCar Rental V2.

New business logic:
- SamCar is commission-based
- The company owner does not always own the cars
- Admin contacts partner car owners first
- If a partner confirms a car is available, admin adds/publishes it
- Public users only see admin-published confirmed cars
- Customer submits a booking request form
- Admin verifies documents and details
- Admin approves or rejects manually
- Admin can send email/SMS
- Admin can generate invoice/receipt
- Admin manages partners, cars, customers, bookings, payments, invoices, and GPS placeholder

Remove old flow:
- Remove public calendar availability flow
- Remove Live Availability checker
- Remove public Pick-up Date / Return Date availability search as the main flow
- Remove Availability nav item
- Replace AvailabilityBar with BookingRequestBar or ConfirmedCarsBar

First task:
Inspect the current project files and create a file-by-file implementation plan.

Do not code yet.

Output format:
1. Current files/components detected
2. Existing design components to preserve
3. Old flow components to replace
4. Files to create
5. Files to update
6. Database/schema changes needed
7. Step-by-step implementation plan
8. Risks or missing files if any
```

---

## Prompt 2 — Replace AvailabilityBar with BookingRequestBar

```txt
Replace the old AvailabilityBar flow with a new BookingRequestBar.

Important:
Do not remove the overall visual style. Only change the business logic and content.

Use the existing copied components and styling from the old SamCar project as reference.

Old AvailabilityBar should no longer say:
- Find Your Perfect Ride
- Check real-time availability
- Live Availability
- Pick-up Date
- Return Date
- Check Availability

New BookingRequestBar should preserve the old floating card style:
- rounded-2xl
- bg-white dark:bg-[#111111]
- border
- shadow
- red top accent bar
- brand red CTA
- premium spacing
- light/dark support
- same visual feel as the old homepage section

New copy:
"Need a car for specific dates?"
"Submit your booking request and SamCar will verify available units from trusted partner owners."

Buttons:
- Start Booking Request -> /book
- View Confirmed Cars -> /cars

Keep the visual design similar to the old AvailabilityBar, but remove real-time availability checking.
```

---

## Prompt 3 — Update Public Header Navigation

```txt
Update the public Header navigation for SamCar Rental V2.

Use the existing copied Header component as the base.

Keep the old Header style:
- fixed top
- logo left
- desktop nav center
- ThemeToggle on right
- Login and Book Now buttons
- mobile hamburger
- red underline hover
- white/dark transparent background
- backdrop blur
- brand red hover states

Change nav links to:
Home -> /
Cars -> /cars
About -> /#about
How it Works -> /#how-it-works
Booking -> /book
Contact -> /#contact

Remove:
Availability -> /availability

Keep:
- Theme toggle
- Login button
- Book Now CTA
- SamCar logo
- Mobile menu
- Existing animation/hover behavior
```

---

## Prompt 4 — Update Homepage Copy Without Changing Design

```txt
Update the homepage sections while preserving the old SamCar visual design.

Use the existing copied homepage and components as the base.

Do not redesign the page.
Do not change the color branding.
Do not replace the existing visual identity.
Only update the wording and booking flow.

Hero subtitle:
"Browse confirmed available cars from SamCar’s trusted partner owners. Submit your booking request and our team will verify availability, documents, and payment details."

Replace old availability messaging with:
"Confirmed Available Cars"
"Browse vehicles that SamCar has verified from trusted partner car owners."

How It Works:
1. Browse Confirmed Cars
View vehicles SamCar has confirmed from trusted partner car owners.

2. Submit Booking Request
Send your rental dates, destination, pickup details, and required documents.

3. Wait for Admin Verification
Our team reviews your request, validates documents, and confirms final availability.

4. Pay and Receive Confirmation
Once approved, receive payment instructions, SMS/email confirmation, and invoice or receipt.

Why Choose:
- Trusted Partner Cars
- Admin-Verified Bookings
- Flexible Rental Options
- Easy Document Submission
- SMS and Email Updates
- Local Lucena Support

Remove old copy that implies public real-time calendar availability.
```

---

## Prompt 5 — Update Public Cars Page Logic

```txt
Update or create the public cars page for SamCar Rental V2.

Route:
- /cars

Use the existing SamCar car card design and car images from:
- public/images/cars/

Business rule:
Only show cars publicly when:
- status = PUBLISHED
- isPublic = true

Car card should show:
- Car image
- Status badge: Confirmed Available
- Brand
- Model
- Year
- Car name
- Seats
- Transmission
- Fuel type
- Pricing text, example: Starts from ₱999/day
- Available from
- Available to
- View Details button
- Book Now button

Important:
Do not make this a public real-time calendar search.
Cars are shown because admin manually confirmed and published them.

Keep the old SamCar card styling:
- rounded cards
- brand red accents
- light/dark mode support
- premium hover effects
```

---

## Prompt 6 — Prisma V2 Schema

```txt
Create the Prisma schema for SamCar Rental V2.

This is a commission-based rental system.

The old schema may have:
- User
- Car
- Booking
- Payment
- BlockedDate

V2 needs:
- User
- Customer
- Partner
- Car
- CarImage
- CarAvailability
- Booking
- BookingDocument
- Payment
- Invoice
- NotificationLog
- GpsDevice
- GpsLocation
- AuditLog

Use enums:

BookingStatus:
PENDING_VERIFICATION
UNDER_REVIEW
APPROVED
REJECTED
CANCELLED
COMPLETED

PaymentStatus:
UNPAID
PARTIALLY_PAID
PAID
REFUNDED

CarStatus:
DRAFT
CONFIRMED_AVAILABLE
PUBLISHED
UNAVAILABLE
ARCHIVED

CustomerVerificationStatus:
UNVERIFIED
PENDING_REVIEW
VERIFIED
BLACKLISTED

TransmissionType:
AUTOMATIC
MANUAL

FuelType:
GASOLINE
DIESEL
HYBRID
ELECTRIC
OTHER

Public car rule:
Only show cars publicly when:
status = PUBLISHED
isPublic = true

Privacy rule:
Government IDs, selfie with ID, proof of billing, payment proof, admin notes, and partner private details must be admin-only.

Create the schema and explain:
1. What changed from the old schema
2. Migration steps
3. Seed data plan
4. Admin user creation plan
```

---

## Prompt 7 — Build Public Booking Form

```txt
Build the SamCar V2 booking form.

Use the copied SamCar visual design as the base.

Preserve:
- bg-section
- white/dark card
- rounded-2xl
- brand red section labels
- brand red submit button
- light/dark mode support
- premium form spacing
- mobile responsive style

Route:
- /book

Success route:
- /booking-success

Fields:
- Full Name
- Contact Number
- Email
- Full Residential Address
- Start Rental Date and Time
- End Rental Date and Time
- Purpose of Rental
- Destination
- Car Rental with Driver yes/no
- Type of Car
- Number of Passengers
- Pickup Address
- Drop-off Address
- Facebook Account Name
- Notes / Special Request
- Government ID 1 Upload
- Government ID 2 Upload
- Selfie Holding Valid ID Upload
- Recent Proof of Billing Upload

Requirements:
- Use Zod validation
- Save or create Customer
- Save Booking
- Save BookingDocument records
- Initial booking status must be PENDING_VERIFICATION
- Redirect to /booking-success
- Show friendly validation errors
- Do not expose uploaded private documents publicly
- Keep the form visually consistent with old SamCar design
```

---

## Prompt 8 — Build Admin Dashboard Structure

```txt
Build the SamCar V2 admin dashboard structure.

Use SamCar branding, not a generic dashboard theme.

Keep:
- Brand Red #f41918
- Deep Red #c71926
- light/dark mode support
- ThemeToggle in topbar
- SamCar logo in sidebar
- rounded 2xl cards
- red action buttons
- premium clean dashboard style

Admin layout:
- dark sidebar
- brand red active item
- main dashboard area
- topbar
- responsive mobile sidebar/drawer

Admin pages:
- /admin/login
- /admin/dashboard
- /admin/bookings
- /admin/bookings/[id]
- /admin/cars
- /admin/cars/[id]
- /admin/partners
- /admin/partners/[id]
- /admin/customers
- /admin/customers/[id]
- /admin/payments
- /admin/invoices
- /admin/invoices/[id]
- /admin/gps
- /admin/notifications
- /admin/settings

Features:
- Approve/reject bookings
- Send SMS/email
- Generate invoice
- Manage partners
- Manage cars
- Publish/unpublish cars
- Track customers
- Track payments
- GPS placeholder

Do not build a generic blue dashboard. Use SamCar red branding.
```

---

## Prompt 9 — Cars and Partners Management

```txt
Build cars and partners management for SamCar Rental V2.

Business logic:
SamCar does not always own the cars. Cars can be provided by partner car owners.

Car requirements:
- Add car
- Edit car
- Upload car images
- Assign partner owner
- Set brand/model/year
- Set seats
- Set transmission
- Set fuel type
- Set pricing text, example: Starts from ₱999/day
- Set available from/to
- Set status
- Publish/unpublish
- Archive

Partner requirements:
- Add partner
- Edit partner
- Contact number
- Email
- Facebook
- Address
- Commission notes
- View partner cars
- View related bookings if available

Public rule:
Only PUBLISHED and isPublic cars appear on /cars and homepage.

Design rule:
Use SamCar red branding and existing dashboard style.
```

---

## Prompt 10 — Bookings Management

```txt
Build bookings management for SamCar Rental V2.

Booking table:
- Search
- Filter by booking status
- Filter by payment status
- Filter by date
- View booking
- Approve
- Reject
- Send SMS
- Send email
- Generate invoice

Booking details page:
- Customer info
- Rental details
- Pickup/drop-off
- Uploaded documents
- Assigned car
- Payment status
- Admin notes
- Notification logs
- Invoice section

Actions:
- Mark UNDER_REVIEW
- Approve booking
- Reject booking
- Cancel booking
- Mark completed
- Assign car
- Update payment status
- Send payment reminder
- Generate invoice

Use status badges with SamCar design.
Use brand red for important CTAs.
Protect uploaded customer documents from public access.
```

---

## Prompt 11 — Payments and Invoice System

```txt
Build payments and invoice system for SamCar Rental V2.

Payment requirements:
- Add payment
- Edit payment
- Mark unpaid
- Mark partially paid
- Mark paid
- Mark refunded
- Payment method
- Reference number
- Upload proof of payment
- Track down payment
- Track balance
- Payment notes

Invoice requirements:
- Generate invoice from approved booking
- Invoice number
- Customer details
- Car details
- Rental dates
- Pickup/drop-off
- Total amount
- Down payment
- Balance
- Payment status
- Printable invoice page
- PDF download
- Send invoice by email later

Design:
Use SamCar red branding, white/dark cards, and printable clean layout.
```

---

## Prompt 12 — Email and SMS Automation

```txt
Add automation features for SamCar Rental V2.

Email provider:
- Resend

SMS provider:
- Semaphore PH or Twilio

Requirements:
- Booking submitted email
- Booking approved email
- Booking rejected email
- Payment reminder email
- Payment reminder SMS
- Invoice email
- NotificationLog record for every message
- Button-based SMS sending first
- Admin can send follow-up SMS manually
- Admin can send email manually
- Store provider response or error

Do not automatically spam SMS.
Use manual admin trigger first except for clear approval/submission messages.

Use environment variables:
- RESEND_API_KEY
- RESEND_FROM_EMAIL
- SMS_PROVIDER
- SMS_API_KEY
```

---

## Prompt 13 — GPS Placeholder

```txt
Create the GPS tracking placeholder for SamCar Rental V2.

Do not integrate a real GPS provider yet unless API documentation is provided.

Build:
- /admin/gps page
- GPS device table
- Add GPS device
- Edit GPS device
- Assign GPS device to car
- Provider field
- IMEI/API device ID field
- Status field
- Placeholder map card

Prepare the database and UI for future live tracking.

Use SamCar dashboard styling:
- dark sidebar
- red accents
- white/dark cards
- clean tables
```

---

## Prompt 14 — Final QA and Cleanup

```txt
Perform a final QA pass for SamCar Rental V2.

Check:
- Old SamCar visual identity is preserved
- Brand Red #f41918 is used
- Deep Red #c71926 is used
- Light/dark mode works
- ThemeToggle works
- Header works on desktop/mobile
- Footer works
- Public homepage no longer uses public calendar availability
- Availability nav item is removed
- BookingRequestBar replaces AvailabilityBar
- Cars page only shows published cars
- Booking form validates and submits
- Admin routes are protected
- Admin dashboard uses SamCar branding
- Private documents are not publicly exposed
- Prisma schema is valid
- npm run build passes
- Vercel deployment is ready

Do not change the design direction during QA.
Only fix bugs, consistency issues, responsiveness, and logic problems.
```
