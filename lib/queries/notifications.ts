import "server-only";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { prisma } from "@/lib/prisma";

export type NotificationChannel = "SMS" | "EMAIL";
/**
 * UI labels. Prisma's `NotificationLog.status` enum is PENDING | SENT | FAILED;
 * we surface PENDING as "QUEUED" in the admin UI and keep "DELIVERED" reserved
 * for a future provider-delivery callback.
 */
export type NotificationStatus = "QUEUED" | "SENT" | "DELIVERED" | "FAILED";

export interface AdminNotification {
  id: string;
  channel: NotificationChannel;
  recipient: string;
  subject: string;
  body: string;
  bookingReference?: string;
  status: NotificationStatus;
  sentAt: string;
  providerResponse?: string;
}

const notificationInclude = {
  booking: { select: { reference: true } },
} as const;

type NotificationRow = {
  id: string;
  type: string;
  status: string;
  recipient: string;
  subject: string;
  body: string;
  providerResponse: string | null;
  sentAt: Date | null;
  createdAt: Date;
  booking: { reference: string } | null;
};

function mapStatus(status: string): NotificationStatus {
  switch (status) {
    case "PENDING":
      return "QUEUED";
    case "SENT":
      return "SENT";
    case "FAILED":
      return "FAILED";
    default:
      return "QUEUED";
  }
}

function toView(n: NotificationRow): AdminNotification {
  return {
    id: n.id,
    channel: n.type === "EMAIL" ? "EMAIL" : "SMS",
    recipient: n.recipient,
    subject: n.subject,
    body: n.body,
    bookingReference: n.booking?.reference ?? undefined,
    status: mapStatus(n.status),
    sentAt: (n.sentAt ?? n.createdAt).toISOString(),
    providerResponse: n.providerResponse ?? undefined,
  };
}

const getCachedNotifications = unstable_cache(
  async () => {
    const rows = await prisma.notificationLog.findMany({
      include: notificationInclude,
      orderBy: [{ sentAt: "desc" }, { createdAt: "desc" }],
    });
    return rows.map(toView);
  },
  ["admin-notifications"],
  { tags: [CACHE_TAGS.notifications], revalidate: 60 },
);

export async function getNotifications(): Promise<AdminNotification[]> {
  return getCachedNotifications();
}
