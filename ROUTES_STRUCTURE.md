# ROUTES_STRUCTURE.md — SamCar Rental V2 Routes

## Old Home Route

Old `app/page.tsx`:

```tsx
<HeroSection cars={cars} />
<AvailabilityBar />
<FeaturedCars cars={cars.slice(0, 6)} />
<HowItWorks />
<WhyChooseUs />
<ContactSection />
```

## New Home Route

V2 should use:

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

## Public Routes

```txt
/
```

Landing page using old SamCar design.

```txt
/cars
```

Public cars listing. Show only `PUBLISHED` and `isPublic = true` cars.

```txt
/cars/[slug]
```

Car details page.

```txt
/book
```

Booking request form.

```txt
/booking-success
```

Booking submitted page.

```txt
/contact
```

Contact page or redirect/anchor to `/#contact`.

## Removed / Changed Route

Old:

```txt
/availability
```

V2:

```txt
Do not use as main public flow.
```

Options:

```txt
Remove route completely
Redirect /availability to /cars
Keep /availability only as internal/admin future feature
```

## Admin Routes

```txt
/admin/login
/admin/dashboard
/admin/bookings
/admin/bookings/new
/admin/bookings/[id]
/admin/cars
/admin/cars/new
/admin/cars/[id]
/admin/partners
/admin/partners/new
/admin/partners/[id]
/admin/customers
/admin/customers/[id]
/admin/payments
/admin/invoices
/admin/invoices/[id]
/admin/gps
/admin/notifications
/admin/settings
```

## API Routes / Server Actions

Use Server Actions where practical.

Suggested actions:

```txt
createBooking
updateBooking
updateBookingStatus
assignCarToBooking
createCar
updateCar
publishCar
unpublishCar
archiveCar
createPartner
updatePartner
createCustomer
updateCustomerVerification
createPayment
updatePaymentStatus
generateInvoice
sendBookingEmail
sendBookingSms
uploadBookingDocument
uploadCarImage
createGpsDevice
assignGpsDeviceToCar
```

## Route Protection

Protect all admin routes except:

```txt
/admin/login
```

## Public Access Rules

Public can view:

```txt
Published cars
Car images
Car public descriptions
Pricing text
Available date range text
Booking form
Contact information
```

Public cannot view:

```txt
Customer documents
Payment proof
Partner private contact details
Admin notes
Audit logs
GPS private data
Internal notification logs
```

## Navigation

Public header:

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

Right-side actions:

```txt
ThemeToggle
Login
Book Now
```
