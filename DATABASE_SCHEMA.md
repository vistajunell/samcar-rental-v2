# DATABASE_SCHEMA.md — SamCar Rental V2 Prisma Schema

## Database Goal

Support a commission-based rental business.

The old schema had:

```txt
User
Car
Booking
Payment
BlockedDate
```

V2 needs partner car owners, document uploads, invoice generation, notifications, and GPS preparation.

## Required Models

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

## Prisma Schema Draft

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

enum UserRole {
  ADMIN
  STAFF
}

enum BookingStatus {
  PENDING_VERIFICATION
  UNDER_REVIEW
  APPROVED
  REJECTED
  CANCELLED
  COMPLETED
}

enum PaymentStatus {
  UNPAID
  PARTIALLY_PAID
  PAID
  REFUNDED
}

enum CarStatus {
  DRAFT
  CONFIRMED_AVAILABLE
  PUBLISHED
  UNAVAILABLE
  ARCHIVED
}

enum CustomerVerificationStatus {
  UNVERIFIED
  PENDING_REVIEW
  VERIFIED
  BLACKLISTED
}

enum TransmissionType {
  AUTOMATIC
  MANUAL
}

enum FuelType {
  GASOLINE
  DIESEL
  HYBRID
  ELECTRIC
  OTHER
}

enum NotificationType {
  EMAIL
  SMS
}

enum NotificationStatus {
  PENDING
  SENT
  FAILED
}

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  name         String
  role         UserRole @default(ADMIN)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  auditLogs AuditLog[]
}

model Customer {
  id                 String                     @id @default(cuid())
  fullName           String
  contactNumber      String
  email              String?
  address            String?
  facebookName       String?
  verificationStatus CustomerVerificationStatus @default(UNVERIFIED)
  notes              String?
  createdAt          DateTime                   @default(now())
  updatedAt          DateTime                   @updatedAt

  bookings Booking[]

  @@index([contactNumber])
  @@index([email])
}

model Partner {
  id              String   @id @default(cuid())
  name            String
  contactNumber   String?
  email           String?
  facebook        String?
  address         String?
  commissionNotes String?
  status          String   @default("ACTIVE")
  notes           String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  cars Car[]
}

model Car {
  id             String           @id @default(cuid())
  partnerId      String?
  slug           String           @unique
  brand          String?
  name           String
  model          String?
  year           Int?
  seats          Int
  transmission   TransmissionType
  fuelType       FuelType
  pricingText    String
  tagline        String?
  description    String?
  availableFrom  DateTime?
  availableTo    DateTime?
  status         CarStatus        @default(DRAFT)
  isPublic       Boolean          @default(false)
  createdAt      DateTime         @default(now())
  updatedAt      DateTime         @updatedAt

  partner        Partner?          @relation(fields: [partnerId], references: [id], onDelete: SetNull)
  images         CarImage[]
  availabilities CarAvailability[]
  bookings       Booking[]
  gpsDevices     GpsDevice[]

  @@index([status])
  @@index([isPublic])
  @@index([partnerId])
}

model CarImage {
  id        String   @id @default(cuid())
  carId     String
  url       String
  publicId  String?
  altText   String?
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())

  car Car @relation(fields: [carId], references: [id], onDelete: Cascade)

  @@index([carId])
}

model CarAvailability {
  id            String   @id @default(cuid())
  carId         String
  availableFrom DateTime
  availableTo   DateTime
  notes         String?
  createdAt     DateTime @default(now())

  car Car @relation(fields: [carId], references: [id], onDelete: Cascade)

  @@index([carId])
  @@index([availableFrom, availableTo])
}

model Booking {
  id               String        @id @default(cuid())
  bookingNumber    String        @unique
  customerId       String
  carId            String?
  status           BookingStatus @default(PENDING_VERIFICATION)
  paymentStatus    PaymentStatus @default(UNPAID)

  startDateTime    DateTime
  endDateTime      DateTime
  purpose          String?
  destination      String?
  withDriver       Boolean       @default(false)
  preferredCarType String?
  passengerCount   Int?
  pickupAddress    String?
  dropoffAddress   String?
  notes            String?
  adminNotes       String?

  totalAmount      Decimal?      @db.Decimal(10, 2)
  downPayment      Decimal?      @db.Decimal(10, 2)
  balanceAmount    Decimal?      @db.Decimal(10, 2)

  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  customer         Customer      @relation(fields: [customerId], references: [id], onDelete: Restrict)
  car              Car?          @relation(fields: [carId], references: [id], onDelete: SetNull)
  documents        BookingDocument[]
  payments         Payment[]
  invoices         Invoice[]
  notifications    NotificationLog[]

  @@index([customerId])
  @@index([carId])
  @@index([status])
  @@index([paymentStatus])
  @@index([startDateTime, endDateTime])
}

model BookingDocument {
  id        String   @id @default(cuid())
  bookingId String
  type      String
  url       String
  publicId  String?
  fileName  String?
  mimeType  String?
  sizeBytes Int?
  isPrivate Boolean  @default(true)
  createdAt DateTime @default(now())

  booking Booking @relation(fields: [bookingId], references: [id], onDelete: Cascade)

  @@index([bookingId])
  @@index([type])
}

model Payment {
  id              String        @id @default(cuid())
  bookingId       String
  amount          Decimal       @db.Decimal(10, 2)
  method          String
  referenceNumber String?
  proofUrl        String?
  status          PaymentStatus @default(UNPAID)
  paidAt          DateTime?
  notes           String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  booking Booking @relation(fields: [bookingId], references: [id], onDelete: Cascade)

  @@index([bookingId])
  @@index([status])
}

model Invoice {
  id            String   @id @default(cuid())
  bookingId     String
  invoiceNumber String   @unique
  subtotal      Decimal  @db.Decimal(10, 2)
  discount      Decimal? @db.Decimal(10, 2)
  total         Decimal  @db.Decimal(10, 2)
  amountPaid    Decimal? @db.Decimal(10, 2)
  balance       Decimal? @db.Decimal(10, 2)
  pdfUrl        String?
  issuedAt      DateTime @default(now())
  createdAt     DateTime @default(now())

  booking Booking @relation(fields: [bookingId], references: [id], onDelete: Cascade)

  @@index([bookingId])
}

model NotificationLog {
  id         String             @id @default(cuid())
  bookingId  String?
  type       NotificationType
  recipient  String
  subject    String?
  message    String
  status     NotificationStatus @default(PENDING)
  provider   String?
  providerId String?
  error      String?
  sentAt     DateTime?
  createdAt  DateTime           @default(now())

  booking Booking? @relation(fields: [bookingId], references: [id], onDelete: SetNull)

  @@index([bookingId])
  @@index([type])
  @@index([status])
}

model GpsDevice {
  id          String   @id @default(cuid())
  carId       String?
  deviceName  String
  provider    String?
  imei        String?
  apiDeviceId String?
  status      String   @default("INACTIVE")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  car       Car?          @relation(fields: [carId], references: [id], onDelete: SetNull)
  locations GpsLocation[]

  @@index([carId])
  @@index([status])
}

model GpsLocation {
  id          String   @id @default(cuid())
  gpsDeviceId String
  latitude    Decimal  @db.Decimal(10, 7)
  longitude   Decimal  @db.Decimal(10, 7)
  speed       Decimal? @db.Decimal(10, 2)
  heading     Decimal? @db.Decimal(10, 2)
  recordedAt  DateTime
  createdAt   DateTime @default(now())

  gpsDevice GpsDevice @relation(fields: [gpsDeviceId], references: [id], onDelete: Cascade)

  @@index([gpsDeviceId])
  @@index([recordedAt])
}

model AuditLog {
  id        String   @id @default(cuid())
  userId    String?
  action    String
  entity    String?
  entityId  String?
  metadata  Json?
  createdAt DateTime @default(now())

  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([userId])
  @@index([entity, entityId])
}
```

## Public Car Query Rule

Public pages should only show:

```txt
status = PUBLISHED
isPublic = true
```

## Privacy Rule

These must be private/admin-only:

```txt
Government IDs
Selfie holding ID
Proof of billing
Payment proof
Partner private contact details
Admin notes
Audit logs
```
