# CHECKLIST.md — SamCar Rental V2 Build Checklist

## Design Preservation

- [ ] Use SamCar logo
- [ ] Use brand red `#f41918`
- [ ] Use deep red `#c71926`
- [ ] Use old light/dark tokens
- [ ] Keep ThemeToggle
- [ ] Keep shine button effect
- [ ] Keep red glow effect
- [ ] Keep premium automotive look
- [ ] Use `/public/images/cars`
- [ ] Use `/public/images/mobile-hero-section-bg.png` where needed
- [ ] Avoid generic blue SaaS design

## Setup

- [ ] Create new GitHub repo
- [ ] Create new Next.js project
- [ ] Install old project stack
- [ ] Install V2 additions
- [ ] Setup Prisma
- [ ] Setup PostgreSQL/Neon
- [ ] Setup environment variables
- [ ] Copy assets
- [ ] Push first commit
- [ ] Create new Vercel project

## Public Website

- [ ] Header
- [ ] Footer
- [ ] ThemeProvider
- [ ] ThemeToggle
- [ ] HeroSection
- [ ] CarShowcaseCard
- [ ] BookingRequestBar replacing AvailabilityBar
- [ ] FeaturedCars / AvailableCars
- [ ] HowItWorks with V2 copy
- [ ] WhyChooseUs with V2 copy
- [ ] ContactSection
- [ ] Cars page
- [ ] Car details page
- [ ] Booking page
- [ ] Booking success page

## Removed Old Flow

- [ ] Remove Availability nav item
- [ ] Remove public live date checker
- [ ] Remove main `/availability` flow or redirect it
- [ ] Remove calendar-first booking logic

## Booking Form

- [ ] Full name
- [ ] Contact number
- [ ] Email
- [ ] Full residential address
- [ ] Start rental date/time
- [ ] End rental date/time
- [ ] Purpose
- [ ] Destination
- [ ] With driver yes/no
- [ ] Type of car
- [ ] Passengers
- [ ] Pickup address
- [ ] Drop-off address
- [ ] Facebook name
- [ ] Notes
- [ ] Government ID 1 upload
- [ ] Government ID 2 upload
- [ ] Selfie with ID upload
- [ ] Proof of billing upload
- [ ] Zod validation
- [ ] Save as PENDING_VERIFICATION

## Admin Dashboard

- [ ] Admin login
- [ ] Protected routes
- [ ] Sidebar
- [ ] Topbar with ThemeToggle
- [ ] Dashboard cards
- [ ] Bookings table
- [ ] Booking details
- [ ] Cars table
- [ ] Partners table
- [ ] Customers table
- [ ] Payments table
- [ ] Invoices table
- [ ] GPS placeholder
- [ ] Notifications log

## Booking Management

- [ ] Add booking manually
- [ ] View booking
- [ ] Approve
- [ ] Reject
- [ ] Cancel
- [ ] Complete
- [ ] Assign car
- [ ] View documents
- [ ] Update payment
- [ ] Send SMS
- [ ] Send email
- [ ] Generate invoice
- [ ] Print receipt

## Cars

- [ ] Add car
- [ ] Edit car
- [ ] Upload images
- [ ] Assign partner
- [ ] Set available dates
- [ ] Pricing text
- [ ] Publish
- [ ] Unpublish
- [ ] Archive

## Partners

- [ ] Add partner
- [ ] Edit partner
- [ ] Contact details
- [ ] Commission notes
- [ ] Partner cars
- [ ] Related bookings

## Security

- [ ] Admin route protection
- [ ] Private uploads
- [ ] No hardcoded API keys
- [ ] Validate file type and size
- [ ] Do not expose government IDs
- [ ] Do not log sensitive customer data
- [ ] Use environment variables
- [ ] Use HTTPS in production

## Deployment

- [ ] Build passes
- [ ] Prisma generate works
- [ ] Environment variables set in Vercel
- [ ] Booking form tested
- [ ] Admin login tested
- [ ] Theme switch tested
- [ ] Mobile tested
- [ ] Email tested
- [ ] SMS tested
- [ ] Invoice tested
