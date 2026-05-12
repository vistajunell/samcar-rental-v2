import { z } from "zod";

const datetimeLocal = z
  .string()
  .min(1)
  .refine((v) => !Number.isNaN(Date.parse(v)), {
    message: "Enter a valid date and time",
  });

export const bookingSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name is required")
      .max(120, "Full name is too long"),
    contactNumber: z
      .string()
      .trim()
      .min(7, "Enter a valid contact number")
      .max(30, "Contact number is too long"),
    email: z.string().trim().email("Enter a valid email address"),
    residentialAddress: z
      .string()
      .trim()
      .min(8, "Residential address is required")
      .max(300, "Address is too long"),
    startDateTime: datetimeLocal,
    endDateTime: datetimeLocal,
    purpose: z
      .string()
      .trim()
      .min(2, "Purpose of rental is required")
      .max(200),
    destination: z
      .string()
      .trim()
      .min(2, "Destination is required")
      .max(200),
    withDriver: z.enum(["yes", "no"], {
      message: "Please select if you need a driver",
    }),
    carSlug: z.string().trim().min(1, "Please select a car"),
    passengers: z.coerce
      .number()
      .int("Number of passengers must be whole")
      .min(1, "At least 1 passenger")
      .max(20, "Too many passengers"),
    pickupAddress: z
      .string()
      .trim()
      .min(4, "Pickup address is required")
      .max(300),
    dropoffAddress: z
      .string()
      .trim()
      .min(4, "Drop-off address is required")
      .max(300),
    facebookName: z.string().trim().max(120).optional().or(z.literal("")),
    notes: z.string().trim().max(1000).optional().or(z.literal("")),
  })
  .refine(
    (v) => Date.parse(v.endDateTime) > Date.parse(v.startDateTime),
    {
      message: "End date/time must be after the start",
      path: ["endDateTime"],
    },
  );

export type BookingInput = z.infer<typeof bookingSchema>;
