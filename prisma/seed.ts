/**
 * SamCar Rental V2 seed.
 *
 *   pnpm prisma db seed     // or: npx prisma db seed
 *
 * Re-runnable: every record uses upsert keyed on a deterministic id, so the
 * seed can be replayed without duplicating rows. IDs match the in-memory mock
 * shape (lib/queries/*) so once the queries are flipped to Prisma the cross-
 * references on the admin pages keep working unchanged.
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not set. Copy .env.example to .env and fill it in.",
  );
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

const ADMIN_EMAIL = "admin@samcar.example";
const ADMIN_PASSWORD = "admin"; // demo only — change in real deployments
const STAFF_EMAIL = "staff@samcar.example";
const STAFF_PASSWORD = "staff";

async function seedUsers() {
  const adminHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const staffHash = await bcrypt.hash(STAFF_PASSWORD, 10);

  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { name: "SamCar Admin", role: "ADMIN" },
    create: {
      id: "u-admin",
      email: ADMIN_EMAIL,
      name: "SamCar Admin",
      passwordHash: adminHash,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: STAFF_EMAIL },
    update: { name: "SamCar Staff", role: "STAFF" },
    create: {
      id: "u-staff",
      email: STAFF_EMAIL,
      name: "SamCar Staff",
      passwordHash: staffHash,
      role: "STAFF",
    },
  });
}

const partners = [
  {
    id: "p1",
    name: "Maria Reyes",
    contactNumber: "+63 917 555 0142",
    email: "maria.reyes@example.ph",
    facebook: "facebook.com/mariareyes.lucena",
    address: "Brgy. Iyam, Lucena City, Quezon",
    commissionPct: "18.00",
    notes: "Long-time partner. Prefers SMS over email for urgent confirmations.",
    joinedAt: new Date("2024-08-12"),
  },
  {
    id: "p2",
    name: "Jorge Santos",
    contactNumber: "+63 918 555 0211",
    email: "jorge.santos@example.ph",
    facebook: "facebook.com/jorge.santos.cars",
    address: "Brgy. Mayao, Lucena City, Quezon",
    commissionPct: "20.00",
    notes: "Owner of two diesel SUVs. Available weekends only for handovers.",
    joinedAt: new Date("2024-11-03"),
  },
  {
    id: "p3",
    name: "Linda Aquino",
    contactNumber: "+63 919 555 0388",
    email: "linda.aquino@example.ph",
    facebook: null,
    address: "Brgy. Ibabang Dupay, Lucena City, Quezon",
    commissionPct: "22.00",
    notes: "New partner since Q1 2026. Friendly, fast confirmations.",
    joinedAt: new Date("2026-01-22"),
  },
  {
    id: "p4",
    name: "Rico Magtalas",
    contactNumber: "+63 920 555 0476",
    email: "rico.magtalas@example.ph",
    facebook: "facebook.com/rico.urvan",
    address: "Brgy. Ibabang Iyam, Lucena City, Quezon",
    commissionPct: "17.00",
    notes: "Specializes in van rentals for tour groups.",
    joinedAt: new Date("2025-04-09"),
  },
  {
    id: "p5",
    name: "Anna del Rosario",
    contactNumber: "+63 921 555 0590",
    email: "anna.delrosario@example.ph",
    facebook: null,
    address: "Brgy. Talao-Talao, Lucena City, Quezon",
    commissionPct: "20.00",
    notes: null,
    joinedAt: new Date("2025-09-17"),
  },
] as const;

async function seedPartners() {
  for (const p of partners) {
    await prisma.partner.upsert({
      where: { id: p.id },
      update: {
        name: p.name,
        contactNumber: p.contactNumber,
        email: p.email,
        facebook: p.facebook,
        address: p.address,
        commissionPct: p.commissionPct,
        notes: p.notes,
        joinedAt: p.joinedAt,
      },
      create: { ...p },
    });
  }
}

const cars = [
  {
    id: "1",
    slug: "toyota-vios-xle-2026",
    brand: "Toyota",
    name: "Vios XLE",
    year: 2026,
    category: "Sedan",
    tagline: "Fuel-efficient family sedan",
    seats: 5,
    transmission: "AUTOMATIC",
    fuelType: "GASOLINE",
    pricePerDay: "2500.00",
    primaryImage: "/images/cars/vios-xle-2026.webp",
    partnerId: "p1",
    availableFrom: "2026-03-01",
    availableTo: "2026-09-30",
  },
  {
    id: "2",
    slug: "toyota-veloz-2025",
    brand: "Toyota",
    name: "Veloz",
    year: 2025,
    category: "MPV",
    tagline: "Spacious 7-seater family MPV",
    seats: 7,
    transmission: "AUTOMATIC",
    fuelType: "GASOLINE",
    pricePerDay: "3500.00",
    primaryImage: "/images/cars/toyota-veloz-2025.webp",
    partnerId: "p1",
    availableFrom: "2026-05-01",
    availableTo: "2026-12-31",
  },
  {
    id: "3",
    slug: "mitsubishi-montero-2024",
    brand: "Mitsubishi",
    name: "Montero Sport",
    year: 2024,
    category: "SUV",
    tagline: "Powerful diesel SUV",
    seats: 7,
    transmission: "AUTOMATIC",
    fuelType: "DIESEL",
    pricePerDay: "4500.00",
    primaryImage: "/images/cars/mitsubishi-montero-2024.webp",
    partnerId: "p2",
    availableFrom: "2026-06-01",
    availableTo: "2026-11-30",
  },
  {
    id: "4",
    slug: "mitsubishi-xpander-gls-2025",
    brand: "Mitsubishi",
    name: "Xpander GLS",
    year: 2025,
    category: "MPV",
    tagline: "Stylish family MPV",
    seats: 7,
    transmission: "AUTOMATIC",
    fuelType: "GASOLINE",
    pricePerDay: "3200.00",
    primaryImage: "/images/cars/xpander-gls-2025.webp",
    partnerId: "p3",
    availableFrom: "2026-05-01",
    availableTo: "2026-10-31",
  },
  {
    id: "5",
    slug: "toyota-innova-2023",
    brand: "Toyota",
    name: "Innova",
    year: 2023,
    category: "MPV",
    tagline: "Reliable long-trip companion",
    seats: 8,
    transmission: "AUTOMATIC",
    fuelType: "DIESEL",
    pricePerDay: "3800.00",
    primaryImage: "/images/cars/innova-2023.webp",
    partnerId: "p2",
    availableFrom: "2026-04-15",
    availableTo: "2026-12-15",
  },
  {
    id: "6",
    slug: "nissan-urvan-2024",
    brand: "Nissan",
    name: "Urvan Premium",
    year: 2024,
    category: "Van",
    tagline: "Group travel and tours",
    seats: 15,
    transmission: "MANUAL",
    fuelType: "DIESEL",
    pricePerDay: "5500.00",
    primaryImage: "/images/cars/nissan-urvan-2024.webp",
    partnerId: "p4",
    availableFrom: "2026-07-01",
    availableTo: "2026-12-31",
  },
  {
    id: "7",
    slug: "mitsubishi-mirage-g4-2025",
    brand: "Mitsubishi",
    name: "Mirage G4",
    year: 2025,
    category: "Sedan",
    tagline: "Compact and economical",
    seats: 5,
    transmission: "AUTOMATIC",
    fuelType: "GASOLINE",
    pricePerDay: "2200.00",
    primaryImage: "/images/cars/mitsubishi-mirage-g4-2025.webp",
    partnerId: "p5",
    availableFrom: "2026-05-15",
    availableTo: "2026-10-15",
  },
  {
    id: "8",
    slug: "mg-5-2025",
    brand: "MG",
    name: "MG 5",
    year: 2025,
    category: "Sedan",
    tagline: "Modern styling, smooth drive",
    seats: 5,
    transmission: "AUTOMATIC",
    fuelType: "GASOLINE",
    pricePerDay: "2600.00",
    primaryImage: "/images/cars/mg-5-2025.webp",
    partnerId: "p3",
    availableFrom: "2026-05-01",
    availableTo: "2026-11-30",
  },
  {
    id: "9",
    slug: "toyota-ativ-2026",
    brand: "Toyota",
    name: "Vios Ativ",
    year: 2026,
    category: "Sedan",
    tagline: "Refreshed sporty look",
    seats: 5,
    transmission: "AUTOMATIC",
    fuelType: "GASOLINE",
    pricePerDay: "2700.00",
    primaryImage: "/images/cars/toyota-ativ-2026.webp",
    partnerId: "p1",
    availableFrom: "2026-06-01",
    availableTo: "2026-12-31",
  },
] as const;

async function seedCars() {
  for (const c of cars) {
    await prisma.car.upsert({
      where: { id: c.id },
      update: {
        slug: c.slug,
        brand: c.brand,
        name: c.name,
        year: c.year,
        category: c.category,
        tagline: c.tagline,
        seats: c.seats,
        transmission: c.transmission,
        fuelType: c.fuelType,
        pricePerDay: c.pricePerDay,
        status: "PUBLISHED",
        isPublic: true,
        partnerId: c.partnerId,
        primaryImage: c.primaryImage,
      },
      create: {
        id: c.id,
        slug: c.slug,
        brand: c.brand,
        name: c.name,
        year: c.year,
        category: c.category,
        tagline: c.tagline,
        seats: c.seats,
        transmission: c.transmission,
        fuelType: c.fuelType,
        pricePerDay: c.pricePerDay,
        status: "PUBLISHED",
        isPublic: true,
        partnerId: c.partnerId,
        primaryImage: c.primaryImage,
      },
    });

    // Primary CarImage row mirroring the local /public/images/cars/* file.
    await prisma.carImage.upsert({
      where: { id: `img-${c.id}` },
      update: { url: c.primaryImage, isPrimary: true, position: 0 },
      create: {
        id: `img-${c.id}`,
        carId: c.id,
        url: c.primaryImage,
        publicId: null,
        isPrimary: true,
        position: 0,
      },
    });

    // Partner-confirmed availability window.
    await prisma.carAvailability.upsert({
      where: { id: `avail-${c.id}` },
      update: {
        from: new Date(c.availableFrom),
        to: new Date(c.availableTo),
      },
      create: {
        id: `avail-${c.id}`,
        carId: c.id,
        from: new Date(c.availableFrom),
        to: new Date(c.availableTo),
        notes: "Partner-confirmed window from initial seed.",
      },
    });
  }
}

const customers = [
  {
    id: "c1",
    name: "Juan Dela Cruz",
    email: "juan.delacruz@example.ph",
    contactNumber: "+63 917 222 3344",
    facebookName: "Juan Dela Cruz",
    address: "Brgy. Iyam, Lucena City, Quezon",
    verificationStatus: "VERIFIED",
    notes: "Repeat customer. Prefers Toyota MPVs.",
    joinedAt: new Date("2025-12-01"),
  },
  {
    id: "c2",
    name: "Maricel Lim",
    email: "maricel.lim@example.ph",
    contactNumber: "+63 918 333 7788",
    facebookName: "Maricel Lim",
    address: "Brgy. Mayao, Lucena City, Quezon",
    verificationStatus: "PENDING_REVIEW",
    notes: "Selfie ID upload is blurry — request resubmission.",
    joinedAt: new Date("2026-04-29"),
  },
  {
    id: "c3",
    name: "Roberto Santiago",
    email: "robert.santiago@example.ph",
    contactNumber: "+63 919 555 1212",
    facebookName: null,
    address: "Brgy. Ilayang Dupay, Lucena City, Quezon",
    verificationStatus: "VERIFIED",
    notes: null,
    joinedAt: new Date("2026-01-15"),
  },
  {
    id: "c4",
    name: "Patricia Yap",
    email: "patricia.yap@example.ph",
    contactNumber: "+63 920 444 5566",
    facebookName: "Patty Yap",
    address: "Brgy. Talao-Talao, Lucena City, Quezon",
    verificationStatus: "UNVERIFIED",
    notes: "Documents not yet uploaded.",
    joinedAt: new Date("2026-05-01"),
  },
  {
    id: "c5",
    name: "Mark Villanueva",
    email: "mark.villanueva@example.ph",
    contactNumber: "+63 921 999 0011",
    facebookName: null,
    address: "Brgy. Ibabang Iyam, Lucena City, Quezon",
    verificationStatus: "BLACKLISTED",
    notes: "Returned previous unit damaged and unpaid.",
    joinedAt: new Date("2025-10-04"),
  },
] as const;

async function seedCustomers() {
  for (const c of customers) {
    await prisma.customer.upsert({
      where: { id: c.id },
      update: {
        name: c.name,
        email: c.email,
        contactNumber: c.contactNumber,
        facebookName: c.facebookName,
        address: c.address,
        verificationStatus: c.verificationStatus,
        notes: c.notes,
        joinedAt: c.joinedAt,
      },
      create: { ...c },
    });
  }
}

interface SeedDocument {
  type:
    | "GOVERNMENT_ID_1"
    | "GOVERNMENT_ID_2"
    | "SELFIE_WITH_ID"
    | "PROOF_OF_BILLING";
  filename: string;
  size: number;
  mimeType: string;
}

interface SeedBooking {
  id: string;
  reference: string;
  customerId: string;
  carId: string;
  startDateTime: string;
  endDateTime: string;
  durationDays: number;
  purpose: string;
  destination: string;
  withDriver: boolean;
  passengers: number;
  pickupAddress: string;
  dropoffAddress: string;
  notes?: string | null;
  adminNotes?: string | null;
  status:
    | "PENDING_VERIFICATION"
    | "UNDER_REVIEW"
    | "APPROVED"
    | "REJECTED"
    | "CANCELLED"
    | "COMPLETED";
  paymentStatus: "UNPAID" | "PARTIALLY_PAID" | "PAID" | "REFUNDED";
  totalAmount: string;
  paidAmount: string;
  createdAt: string;
  documents: SeedDocument[];
}

const bookings: SeedBooking[] = [
  {
    id: "b1",
    reference: "SCR-20260505-A3F9X1",
    customerId: "c2",
    carId: "2",
    startDateTime: "2026-05-12T08:00:00Z",
    endDateTime: "2026-05-15T18:00:00Z",
    durationDays: 3,
    purpose: "Family weekend trip",
    destination: "Tagaytay City",
    withDriver: false,
    passengers: 5,
    pickupAddress: "Lucena Grand Central Terminal",
    dropoffAddress: "Lucena Grand Central Terminal",
    notes: "Need child seat if available.",
    adminNotes: null,
    status: "PENDING_VERIFICATION",
    paymentStatus: "UNPAID",
    totalAmount: "10500.00",
    paidAmount: "0.00",
    createdAt: "2026-05-05T07:14:00Z",
    documents: [
      { type: "GOVERNMENT_ID_1", filename: "drivers-license.jpg", size: 1_200_000, mimeType: "image/jpeg" },
      { type: "GOVERNMENT_ID_2", filename: "passport.jpg", size: 1_600_000, mimeType: "image/jpeg" },
      { type: "SELFIE_WITH_ID", filename: "selfie-id.jpg", size: 2_100_000, mimeType: "image/jpeg" },
      { type: "PROOF_OF_BILLING", filename: "meralco-bill-apr.pdf", size: 284_000, mimeType: "application/pdf" },
    ],
  },
  {
    id: "b2",
    reference: "SCR-20260504-K2P7M9",
    customerId: "c1",
    carId: "5",
    startDateTime: "2026-05-20T06:00:00Z",
    endDateTime: "2026-05-23T20:00:00Z",
    durationDays: 3,
    purpose: "Out-of-town family event",
    destination: "Sariaya, Quezon",
    withDriver: true,
    passengers: 7,
    pickupAddress: "Customer's residence — Brgy. Iyam",
    dropoffAddress: "Customer's residence — Brgy. Iyam",
    notes: null,
    adminNotes: "Repeat customer. Approved on the spot.",
    status: "APPROVED",
    paymentStatus: "PARTIALLY_PAID",
    totalAmount: "11400.00",
    paidAmount: "5000.00",
    createdAt: "2026-05-04T11:32:00Z",
    documents: [
      { type: "GOVERNMENT_ID_1", filename: "drivers-license.jpg", size: 988_000, mimeType: "image/jpeg" },
      { type: "GOVERNMENT_ID_2", filename: "voters-id.jpg", size: 1_400_000, mimeType: "image/jpeg" },
      { type: "SELFIE_WITH_ID", filename: "selfie.jpg", size: 1_800_000, mimeType: "image/jpeg" },
      { type: "PROOF_OF_BILLING", filename: "globe-bill.pdf", size: 412_000, mimeType: "application/pdf" },
    ],
  },
  {
    id: "b3",
    reference: "SCR-20260502-Q5R8T2",
    customerId: "c3",
    carId: "1",
    startDateTime: "2026-05-08T09:00:00Z",
    endDateTime: "2026-05-09T18:00:00Z",
    durationDays: 2,
    purpose: "Business meeting",
    destination: "Lucena → Manila → Lucena",
    withDriver: false,
    passengers: 2,
    pickupAddress: "SamCar Office — Brgy. Iyam",
    dropoffAddress: "SamCar Office — Brgy. Iyam",
    notes: null,
    adminNotes: null,
    status: "UNDER_REVIEW",
    paymentStatus: "UNPAID",
    totalAmount: "5000.00",
    paidAmount: "0.00",
    createdAt: "2026-05-02T15:08:00Z",
    documents: [
      { type: "GOVERNMENT_ID_1", filename: "license.jpg", size: 1_100_000, mimeType: "image/jpeg" },
      { type: "GOVERNMENT_ID_2", filename: "tin-id.jpg", size: 920_000, mimeType: "image/jpeg" },
      { type: "SELFIE_WITH_ID", filename: "selfie.jpg", size: 1_700_000, mimeType: "image/jpeg" },
      { type: "PROOF_OF_BILLING", filename: "pldt-bill.pdf", size: 356_000, mimeType: "application/pdf" },
    ],
  },
  {
    id: "b4",
    reference: "SCR-20260428-J9N4V7",
    customerId: "c1",
    carId: "3",
    startDateTime: "2026-04-15T08:00:00Z",
    endDateTime: "2026-04-22T20:00:00Z",
    durationDays: 7,
    purpose: "Holy Week vacation",
    destination: "Pagudpud, Ilocos Norte",
    withDriver: false,
    passengers: 6,
    pickupAddress: "Customer residence",
    dropoffAddress: "Customer residence",
    notes: null,
    adminNotes: "Returned on time. Full deposit refunded.",
    status: "COMPLETED",
    paymentStatus: "PAID",
    totalAmount: "31500.00",
    paidAmount: "31500.00",
    createdAt: "2026-03-28T19:45:00Z",
    documents: [
      { type: "GOVERNMENT_ID_1", filename: "license.jpg", size: 1_000_000, mimeType: "image/jpeg" },
      { type: "GOVERNMENT_ID_2", filename: "passport.jpg", size: 1_500_000, mimeType: "image/jpeg" },
      { type: "SELFIE_WITH_ID", filename: "selfie.jpg", size: 1_600_000, mimeType: "image/jpeg" },
      { type: "PROOF_OF_BILLING", filename: "meralco.pdf", size: 298_000, mimeType: "application/pdf" },
    ],
  },
  {
    id: "b5",
    reference: "SCR-20260501-D7H2W4",
    customerId: "c4",
    carId: "8",
    startDateTime: "2026-05-09T10:00:00Z",
    endDateTime: "2026-05-11T18:00:00Z",
    durationDays: 2,
    purpose: "Personal errand",
    destination: "Within Lucena",
    withDriver: false,
    passengers: 2,
    pickupAddress: "Brgy. Talao-Talao",
    dropoffAddress: "Brgy. Talao-Talao",
    notes: null,
    adminNotes:
      "Submitted IDs do not match name on form — requested resubmission, customer never replied.",
    status: "REJECTED",
    paymentStatus: "UNPAID",
    totalAmount: "5200.00",
    paidAmount: "0.00",
    createdAt: "2026-05-01T20:11:00Z",
    documents: [
      { type: "GOVERNMENT_ID_1", filename: "id1.jpg", size: 640_000, mimeType: "image/jpeg" },
      { type: "GOVERNMENT_ID_2", filename: "id2.jpg", size: 580_000, mimeType: "image/jpeg" },
      { type: "SELFIE_WITH_ID", filename: "selfie.jpg", size: 1_100_000, mimeType: "image/jpeg" },
      { type: "PROOF_OF_BILLING", filename: "bill.pdf", size: 210_000, mimeType: "application/pdf" },
    ],
  },
  {
    id: "b6",
    reference: "SCR-20260430-X8Z3L6",
    customerId: "c3",
    carId: "9",
    startDateTime: "2026-06-03T09:00:00Z",
    endDateTime: "2026-06-05T18:00:00Z",
    durationDays: 2,
    purpose: "Wedding event",
    destination: "Lucban, Quezon",
    withDriver: true,
    passengers: 4,
    pickupAddress: "Holy Cross Cathedral, Lucena",
    dropoffAddress: "Holy Cross Cathedral, Lucena",
    notes: null,
    adminNotes: "Driver assignment: Kuya Romeo.",
    status: "APPROVED",
    paymentStatus: "PAID",
    totalAmount: "6800.00",
    paidAmount: "6800.00",
    createdAt: "2026-04-30T13:22:00Z",
    documents: [
      { type: "GOVERNMENT_ID_1", filename: "license.jpg", size: 1_300_000, mimeType: "image/jpeg" },
      { type: "GOVERNMENT_ID_2", filename: "voters-id.jpg", size: 1_000_000, mimeType: "image/jpeg" },
      { type: "SELFIE_WITH_ID", filename: "selfie.jpg", size: 2_200_000, mimeType: "image/jpeg" },
      { type: "PROOF_OF_BILLING", filename: "billing.pdf", size: 320_000, mimeType: "application/pdf" },
    ],
  },
];

async function seedBookings() {
  for (const b of bookings) {
    await prisma.booking.upsert({
      where: { id: b.id },
      update: {
        reference: b.reference,
        customerId: b.customerId,
        carId: b.carId,
        startDateTime: new Date(b.startDateTime),
        endDateTime: new Date(b.endDateTime),
        durationDays: b.durationDays,
        purpose: b.purpose,
        destination: b.destination,
        withDriver: b.withDriver,
        passengers: b.passengers,
        pickupAddress: b.pickupAddress,
        dropoffAddress: b.dropoffAddress,
        notes: b.notes,
        adminNotes: b.adminNotes,
        status: b.status,
        paymentStatus: b.paymentStatus,
        totalAmount: b.totalAmount,
        paidAmount: b.paidAmount,
        createdAt: new Date(b.createdAt),
      },
      create: {
        id: b.id,
        reference: b.reference,
        customerId: b.customerId,
        carId: b.carId,
        startDateTime: new Date(b.startDateTime),
        endDateTime: new Date(b.endDateTime),
        durationDays: b.durationDays,
        purpose: b.purpose,
        destination: b.destination,
        withDriver: b.withDriver,
        passengers: b.passengers,
        pickupAddress: b.pickupAddress,
        dropoffAddress: b.dropoffAddress,
        notes: b.notes,
        adminNotes: b.adminNotes,
        status: b.status,
        paymentStatus: b.paymentStatus,
        totalAmount: b.totalAmount,
        paidAmount: b.paidAmount,
        createdAt: new Date(b.createdAt),
      },
    });

    // Documents — upsert each by deterministic id so re-runs don't duplicate.
    for (let i = 0; i < b.documents.length; i++) {
      const d = b.documents[i]!;
      const docId = `${b.id}-${d.type.toLowerCase()}`;
      await prisma.bookingDocument.upsert({
        where: { id: docId },
        update: {
          type: d.type,
          filename: d.filename,
          mimeType: d.mimeType,
          size: d.size,
        },
        create: {
          id: docId,
          bookingId: b.id,
          type: d.type,
          // Mock URL — real Cloudinary URLs land when uploads are wired.
          url: `mock://documents/${b.id}/${d.filename}`,
          publicId: null,
          filename: d.filename,
          mimeType: d.mimeType,
          size: d.size,
        },
      });
    }
  }
}

const payments = [
  {
    id: "pay1",
    bookingId: "b2",
    amount: "5000.00",
    method: "GCASH",
    reference: "GC-3829471",
    receivedAt: new Date("2026-05-04T14:18:00Z"),
    proofUrl: "mock://payments/pay1/gcash-screenshot.jpg",
    notes: "Down payment.",
  },
  {
    id: "pay2",
    bookingId: "b4",
    amount: "15000.00",
    method: "BANK_TRANSFER",
    reference: "BPI-998211",
    receivedAt: new Date("2026-03-30T10:11:00Z"),
    proofUrl: "mock://payments/pay2/bpi-receipt.pdf",
    notes: "50% deposit.",
  },
  {
    id: "pay3",
    bookingId: "b4",
    amount: "16500.00",
    method: "CASH",
    reference: "CASH-OFFICE",
    receivedAt: new Date("2026-04-22T19:30:00Z"),
    proofUrl: null,
    notes: "Final balance settled at car return.",
  },
  {
    id: "pay4",
    bookingId: "b6",
    amount: "6800.00",
    method: "GCASH",
    reference: "GC-4427110",
    receivedAt: new Date("2026-05-01T09:42:00Z"),
    proofUrl: "mock://payments/pay4/gcash-rsantiago.jpg",
    notes: "Full payment upfront.",
  },
] as const;

async function seedPayments() {
  for (const p of payments) {
    await prisma.payment.upsert({
      where: { id: p.id },
      update: {
        amount: p.amount,
        method: p.method,
        reference: p.reference,
        receivedAt: p.receivedAt,
        proofUrl: p.proofUrl,
        notes: p.notes,
      },
      create: { ...p },
    });
  }
}

const invoices = [
  {
    id: "inv1",
    number: "INV-2026-0042",
    bookingId: "b2",
    customerName: "Juan Dela Cruz",
    customerEmail: "juan.delacruz@example.ph",
    carLabel: "Toyota Innova 2023",
    rentalStart: new Date("2026-05-20T06:00:00Z"),
    rentalEnd: new Date("2026-05-23T20:00:00Z"),
    pickupAddress: "Customer's residence — Brgy. Iyam",
    dropoffAddress: "Customer's residence — Brgy. Iyam",
    subtotal: "11400.00",
    driverFee: "0.00",
    total: "11400.00",
    paid: "5000.00",
    balance: "6400.00",
    paymentStatus: "PARTIALLY_PAID",
    issuedAt: new Date("2026-05-04T12:00:00Z"),
    dueDate: new Date("2026-05-20T00:00:00Z"),
    notes: "Balance due upon car handover.",
  },
  {
    id: "inv2",
    number: "INV-2026-0038",
    bookingId: "b4",
    customerName: "Juan Dela Cruz",
    customerEmail: "juan.delacruz@example.ph",
    carLabel: "Mitsubishi Montero Sport 2024",
    rentalStart: new Date("2026-04-15T08:00:00Z"),
    rentalEnd: new Date("2026-04-22T20:00:00Z"),
    pickupAddress: "Customer residence",
    dropoffAddress: "Customer residence",
    subtotal: "31500.00",
    driverFee: "0.00",
    total: "31500.00",
    paid: "31500.00",
    balance: "0.00",
    paymentStatus: "PAID",
    issuedAt: new Date("2026-03-29T14:00:00Z"),
    dueDate: new Date("2026-04-15T00:00:00Z"),
    notes: "Settled in two payments. Full receipt issued.",
  },
  {
    id: "inv3",
    number: "INV-2026-0041",
    bookingId: "b6",
    customerName: "Roberto Santiago",
    customerEmail: "robert.santiago@example.ph",
    carLabel: "Toyota Vios Ativ 2026",
    rentalStart: new Date("2026-06-03T09:00:00Z"),
    rentalEnd: new Date("2026-06-05T18:00:00Z"),
    pickupAddress: "Holy Cross Cathedral, Lucena",
    dropoffAddress: "Holy Cross Cathedral, Lucena",
    subtotal: "5400.00",
    driverFee: "1400.00",
    total: "6800.00",
    paid: "6800.00",
    balance: "0.00",
    paymentStatus: "PAID",
    issuedAt: new Date("2026-05-01T08:30:00Z"),
    dueDate: new Date("2026-06-03T00:00:00Z"),
    notes: "Driver fee included.",
  },
] as const;

async function seedInvoices() {
  for (const i of invoices) {
    await prisma.invoice.upsert({
      where: { id: i.id },
      update: { ...i },
      create: { ...i },
    });
  }
}

const notifications = [
  {
    id: "n1",
    type: "EMAIL",
    status: "SENT",
    recipient: "juan.delacruz@example.ph",
    subject: "Booking SCR-20260504-K2P7M9 — Approved",
    body: "Your booking has been approved. Please settle the down payment to confirm.",
    bookingId: "b2",
    providerResponse: "Resend id=re_4kS3...",
    sentAt: new Date("2026-05-04T11:50:00Z"),
  },
  {
    id: "n2",
    type: "SMS",
    status: "SENT",
    recipient: "+63 917 222 3344",
    subject: "Booking approved",
    body: "SAMCAR: Your booking SCR-20260504 is approved. Reply YES to confirm. -SamCar Rental",
    bookingId: "b2",
    providerResponse: "Semaphore msg=4129881",
    sentAt: new Date("2026-05-04T11:51:00Z"),
  },
  {
    id: "n3",
    type: "EMAIL",
    status: "PENDING",
    recipient: "robert.santiago@example.ph",
    subject: "Booking SCR-20260502-Q5R8T2 — Under review",
    body: "We're verifying your documents and confirming with the partner owner.",
    bookingId: "b3",
    providerResponse: null,
    sentAt: null,
  },
  {
    id: "n4",
    type: "SMS",
    status: "FAILED",
    recipient: "+63 920 444 5566",
    subject: "Booking rejected",
    body: "SAMCAR: Booking SCR-20260501 cannot be approved due to ID mismatch. Reply for details.",
    bookingId: "b5",
    providerResponse: "Semaphore err=invalid_recipient",
    sentAt: new Date("2026-05-02T08:09:00Z"),
  },
] as const;

async function seedNotifications() {
  for (const n of notifications) {
    await prisma.notificationLog.upsert({
      where: { id: n.id },
      update: { ...n },
      create: { ...n },
    });
  }
}

const gpsDevices = [
  { id: "g1", imei: "865784049012345", provider: "Concox JM-VL01", carId: "2", status: "ONLINE" },
  { id: "g2", imei: "865784049012346", provider: "Concox JM-VL01", carId: "5", status: "OFFLINE" },
  { id: "g3", imei: "865784049012347", provider: "Teltonika FMC130", carId: null, status: "UNASSIGNED" },
] as const;

async function seedGpsDevices() {
  for (const d of gpsDevices) {
    await prisma.gpsDevice.upsert({
      where: { id: d.id },
      update: {
        imei: d.imei,
        provider: d.provider,
        carId: d.carId,
        status: d.status,
      },
      create: { ...d },
    });
  }
}

async function main() {
  console.log("Seeding SamCar Rental V2…");
  await seedUsers();
  await seedPartners();
  await seedCustomers();
  await seedCars();
  await seedBookings();
  await seedPayments();
  await seedInvoices();
  await seedNotifications();
  await seedGpsDevices();
  console.log("Seed complete.");
  console.log(`  Admin login: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  console.log(`  Staff login: ${STAFF_EMAIL} / ${STAFF_PASSWORD}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
