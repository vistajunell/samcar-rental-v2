import "server-only";

import { Resend } from "resend";
import twilio from "twilio";
import type { BookingStatus } from "@prisma/client";

export type NotificationChannel = "EMAIL" | "SMS";

export interface BookingNotificationContext {
  reference: string;
  customerName: string;
  customerEmail: string;
  customerContact: string;
  carLabel: string;
  startDateTime: Date;
  endDateTime: Date;
  status: BookingStatus;
  paymentStatus: string;
  invoiceNumber?: string | null;
}

export interface NotificationContent {
  subject: string;
  body: string;
}

export interface NotificationDeliveryResult {
  provider: string;
  providerResponse: string;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function statusSummary(status: BookingStatus) {
  switch (status) {
    case "PENDING_VERIFICATION":
      return "Your booking request has been received and is waiting for document review.";
    case "UNDER_REVIEW":
      return "SamCar is reviewing your documents and confirming the vehicle with the partner owner.";
    case "APPROVED":
      return "Your booking request has been approved by SamCar.";
    case "REJECTED":
      return "SamCar could not approve this booking request.";
    case "CANCELLED":
      return "This booking request has been cancelled.";
    case "COMPLETED":
      return "This booking has been marked completed. Thank you for renting with SamCar.";
  }
}

export function buildBookingNotificationContent(
  context: BookingNotificationContext,
  channel: NotificationChannel,
): NotificationContent {
  const summary = statusSummary(context.status);
  const invoiceLine = context.invoiceNumber
    ? `Invoice: ${context.invoiceNumber}`
    : "Invoice: will be shared once available";

  if (channel === "SMS") {
    const smsBody = [
      `SAMCAR: Booking ${context.reference} update.`,
      summary,
      context.status === "APPROVED"
        ? `Payment status: ${context.paymentStatus}.`
        : null,
      context.invoiceNumber ? `Invoice ${context.invoiceNumber}.` : null,
      "Reply to this message or contact SamCar for next steps.",
    ]
      .filter(Boolean)
      .join(" ");

    return {
      subject: `Booking update ${context.reference}`,
      body: smsBody,
    };
  }

  return {
    subject: `SamCar booking update for ${context.reference}`,
    body: [
      `Hello ${context.customerName},`,
      "",
      summary,
      "",
      `Booking reference: ${context.reference}`,
      `Vehicle: ${context.carLabel}`,
      `Rental period: ${formatDate(context.startDateTime)} to ${formatDate(context.endDateTime)}`,
      `Payment status: ${context.paymentStatus}`,
      invoiceLine,
      "",
      "If you have questions, please reply to this email or contact SamCar directly.",
      "",
      "SamCar Rental",
    ].join("\n"),
  };
}

function normalizePhilippineNumber(input: string) {
  const digits = input.replace(/\D/g, "");

  if (digits.startsWith("63") && digits.length === 12) {
    return {
      e164: `+${digits}`,
      local: `0${digits.slice(2)}`,
    };
  }

  if (digits.startsWith("0") && digits.length === 11) {
    return {
      e164: `+63${digits.slice(1)}`,
      local: digits,
    };
  }

  if (digits.startsWith("9") && digits.length === 10) {
    return {
      e164: `+63${digits}`,
      local: `0${digits}`,
    };
  }

  throw new Error("Customer contact number is not a valid Philippine mobile number.");
}

export async function sendEmailNotification(
  recipient: string,
  content: NotificationContent,
): Promise<NotificationDeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    throw new Error("Resend is not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL.");
  }

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from,
    to: [recipient],
    subject: content.subject,
    text: content.body,
  });

  if (error) {
    throw new Error(error.message || "Resend could not send the email.");
  }

  return {
    provider: "resend",
    providerResponse: `Resend id=${data?.id ?? "unknown"}`,
  };
}

function resolveSmsProvider() {
  const configured = (process.env.SMS_PROVIDER ?? "").trim().toLowerCase();
  if (configured) return configured;
  if (process.env.SEMAPHORE_API_KEY) return "semaphore";
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) return "twilio";
  return "";
}

async function sendSemaphoreSms(
  recipient: string,
  content: NotificationContent,
): Promise<NotificationDeliveryResult> {
  const apiKey = process.env.SEMAPHORE_API_KEY;
  if (!apiKey) {
    throw new Error("Semaphore PH is not configured. Set SEMAPHORE_API_KEY.");
  }

  const normalized = normalizePhilippineNumber(recipient);
  const body = new URLSearchParams({
    apikey: apiKey,
    number: normalized.local,
    message: content.body,
  });

  if (process.env.SEMAPHORE_SENDER_NAME) {
    body.set("sendername", process.env.SEMAPHORE_SENDER_NAME);
  }

  const response = await fetch("https://api.semaphore.co/api/v4/messages", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const raw = await response.text();
  if (!response.ok) {
    throw new Error(`Semaphore PH error: ${raw}`);
  }

  let messageId = "unknown";
  try {
    const parsed = JSON.parse(raw) as Array<{ message_id?: number | string }>;
    messageId = String(parsed[0]?.message_id ?? "unknown");
  } catch {
    messageId = "unknown";
  }

  return {
    provider: "semaphore",
    providerResponse: `Semaphore msg=${messageId}`,
  };
}

async function sendTwilioSms(
  recipient: string,
  content: NotificationContent,
): Promise<NotificationDeliveryResult> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;

  if (!accountSid || !authToken || !from) {
    throw new Error(
      "Twilio is not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_FROM_NUMBER.",
    );
  }

  const normalized = normalizePhilippineNumber(recipient);
  const client = twilio(accountSid, authToken);
  const result = await client.messages.create({
    to: normalized.e164,
    from,
    body: content.body,
  });

  return {
    provider: "twilio",
    providerResponse: `Twilio sid=${result.sid}`,
  };
}

export async function sendSmsNotification(
  recipient: string,
  content: NotificationContent,
): Promise<NotificationDeliveryResult> {
  const provider = resolveSmsProvider();

  if (provider === "semaphore") {
    return sendSemaphoreSms(recipient, content);
  }
  if (provider === "twilio") {
    return sendTwilioSms(recipient, content);
  }

  throw new Error(
    "SMS provider is not configured. Set SMS_PROVIDER and the matching provider credentials.",
  );
}
