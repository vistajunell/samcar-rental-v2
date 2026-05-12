# DESIGN.md — SamCar Rental V2 Exact Design System

## Design Goal

Create SamCar Rental V2 using the **exact old SamCar visual identity** while changing the system logic.

This means:

```txt
Same visual brand
Same red accents
Same dark/light mode
Same premium automotive feel
Different backend and business workflow
```

## Do Not Use Generic Blue SaaS Design

Do not use:

```txt
Primary: #2563EB
Blue SaaS theme
Generic corporate dashboard styling
```

Use the SamCar colors instead:

```txt
Brand Red: #f41918
Deep Red: #c71926
```

## Old Design Foundations

The old project uses:

```txt
Tailwind CSS v4
Class-based dark mode
Geist font
Fixed header
Logo image
Theme toggle
Shine buttons
Red glow effects
Rounded premium cards
Dark hero section
Car showcase carousel
Featured car cards
```

## Required Image Assets

Local paths:

```txt
D:\Development\Website\samcar-rental-v2\public\images
D:\Development\Website\samcar-rental-v2\public\images\cars
D:\Development\Website\samcar-rental-v2\public\images\logo\samcar-logo.webp
D:\Development\Website\samcar-rental-v2\public\images\mobile-hero-section-bg.png
```

Next.js paths:

```txt
/images/logo/samcar-logo.webp
/images/mobile-hero-section-bg.png
/images/cars/[car-image-name].webp
```

## CSS Theme Tokens

Use these exact Tailwind v4 tokens:

```css
@import "tailwindcss";

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

## Light Mode

```txt
Background: #ffffff
Foreground: #0a0a0a
Card: #ffffff
Section: #f7f7f7
Body text: #333333
Border: #e5e7eb
Primary CTA: #f41918
CTA hover: #c71926
```

## Dark Mode

```txt
Background: #050505
Foreground: #ffffff
Card: #111111
Section: #0a0a0a
Body text: #d1d1d1
Border: rgba(255,255,255,0.08)
Primary CTA: #f41918
CTA hover: #c71926
```

## Theme Toggle

Keep the old theme toggle behavior.

Requirements:

```txt
Use ThemeProvider
Use localStorage key: theme
Use values: light or dark
Default: dark
Apply .dark class to document.documentElement
Avoid hydration mismatch by showing placeholder until mounted
Use Sun and Moon icons
Show ThemeToggle in public header and admin topbar
```

## Header Design

Follow the old `Header.tsx` style.

Structure:

```txt
Fixed top header
Logo left
Desktop nav center
Theme toggle and CTA right
Mobile hamburger
Backdrop blur
Light mode white/transparent
Dark mode black/transparent
Red hover underline on nav links
```

Desktop header classes should stay close to:

```txt
fixed top-0 left-0 right-0 z-50
bg-white/95 dark:bg-black/90
backdrop-blur-xl
border-b border-black/[.06] dark:border-white/[.06]
```

Logo:

```txt
/images/logo/samcar-logo.webp
```

Recommended nav:

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

## Hero Section

Follow old `HeroSection` visual direction:

```txt
Dark premium full hero
Black background
Red radial glow
Small red badge
Large white heading
Brand red highlighted words
Centered subtitle
Browse Cars CTA
Book Now CTA
Car showcase carousel
Stats row
```

Keep hero style close to:

```txt
relative overflow-hidden bg-black
bg-gradient-to-b from-[#0a0a0a] via-black to-[#0a0a0a]
text-white
brand-red glow accents
```

Suggested hero text:

```txt
Rent Your Ideal Car with SamCar Rental
```

Suggested subheading:

```txt
Browse confirmed available cars from SamCar’s trusted partner owners. Submit your booking request and our team will verify availability, documents, and payment details.
```

## Replace AvailabilityBar

The old home page uses:

```txt
HeroSection
AvailabilityBar
FeaturedCars
HowItWorks
WhyChooseUs
ContactSection
```

For V2, replace `AvailabilityBar` with:

```txt
BookingRequestBar
```

or:

```txt
ConfirmedCarsBar
```

This section should not check real-time availability.

It should say:

```txt
Need a car for specific dates?
Submit your booking request and SamCar will verify available units from trusted partner owners.
```

CTA:

```txt
Start Booking Request
View Confirmed Cars
```

## Featured / Available Cars

Keep old `FeaturedCars` visual style.

Cards should include:

```txt
Car image
Status badge
Brand/year
Car name
Tagline
Seats
Transmission
Fuel type
Pricing text
Available date range
View details
Book now
```

Pricing must support flexible text:

```txt
Starts from ₱999/day
₱2,400/day
Ask for quote
```

## Status Badge Style

Use rounded badges with soft background and border.

Booking:

```txt
PENDING_VERIFICATION = yellow
UNDER_REVIEW = blue
APPROVED = green
REJECTED = red
CANCELLED = gray
COMPLETED = brand red
```

Payment:

```txt
UNPAID = red
PARTIALLY_PAID = yellow
PAID = green
REFUNDED = gray
```

Car:

```txt
DRAFT = gray
CONFIRMED_AVAILABLE = blue
PUBLISHED = green
UNAVAILABLE = red
ARCHIVED = gray
```

## Buttons

Primary:

```txt
shine-btn inline-flex items-center justify-center rounded-xl bg-brand-red hover:bg-deep-red text-white font-bold shadow-lg shadow-brand-red/30
```

Secondary:

```txt
border-2 border-white/30 bg-white/5 text-white hover:border-brand-red hover:text-brand-red
```

Light secondary:

```txt
border border-gray-200 text-gray-700 hover:border-brand-red hover:text-brand-red
```

## Effects

Keep the old effects.

```css
.shine-btn {
  position: relative;
  overflow: hidden;
  isolation: isolate;
}

.shine-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -120%;
  width: 70%;
  height: 100%;
  background: linear-gradient(
    115deg,
    transparent 0%,
    transparent 30%,
    rgba(255, 255, 255, 0.55) 50%,
    transparent 70%,
    transparent 100%
  );
  transform: skewX(-20deg);
  transition: left 0.7s cubic-bezier(0.22, 1, 0.36, 1);
  pointer-events: none;
  z-index: 1;
}

.shine-btn:hover::before {
  left: 130%;
}

.glow-red {
  box-shadow: 0 0 32px -4px rgba(244, 25, 24, 0.45);
}
```

## How It Works Copy

Replace old calendar flow with:

```txt
1. Browse Confirmed Cars
View vehicles SamCar has confirmed from trusted partner car owners.

2. Submit Booking Request
Send your rental dates, destination, pickup details, and required documents.

3. Wait for Admin Verification
Our team reviews your request, validates documents, and confirms final availability.

4. Pay and Receive Confirmation
Once approved, receive payment instructions, SMS/email confirmation, and invoice or receipt.
```

## Why Choose SamCar Copy

Use:

```txt
Trusted Partner Cars
Admin-Verified Bookings
Flexible Rental Options
Easy Document Submission
SMS and Email Updates
Local Lucena Support
```

## Admin Dashboard Design

Dashboard must use SamCar branding.

Use:

```txt
Dark sidebar
Brand red active states
Light dashboard body by default
Dark mode support
Rounded 2xl cards
Clean tables
Red action buttons
Status badges
```

Admin sidebar:

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

## Layout Width

Use old container rule:

```txt
mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8
```

Avoid huge margins.

## Typography

Use Geist.

Headings:

```txt
font-black tracking-tight
```

Section label:

```txt
text-[11px] text-brand-red font-bold uppercase tracking-[0.3em]
```

Muted text:

```txt
text-gray-500 dark:text-gray-400
```

## Final Rule

The new project must feel like:

```txt
The current SamCar Rental website upgraded into V2
```

Not:

```txt
A different website with different colors
```
