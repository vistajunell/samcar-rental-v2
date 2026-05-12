import { format, parseISO } from "date-fns";
import { Mail, MessageSquare, CheckCircle2, XCircle } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import { getNotifications } from "@/lib/queries/notifications";

const statusStyle: Record<string, string> = {
  QUEUED: "bg-gray-500/15 border-gray-500/30 text-gray-700 dark:text-gray-300",
  SENT: "bg-blue-500/15 border-blue-500/30 text-blue-700 dark:text-blue-300",
  DELIVERED:
    "bg-green-500/15 border-green-500/30 text-green-700 dark:text-green-300",
  FAILED: "bg-red-500/15 border-red-500/30 text-red-700 dark:text-red-300",
};

export default async function NotificationsPage() {
  const notes = await getNotifications();

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle={`${notes.length} messages logged across SMS and email.`}
      />

      <div className="rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] overflow-hidden">
        <ul className="divide-y divide-gray-100 dark:divide-white/[.05]">
          {notes.map((n) => {
            const isEmail = n.channel === "EMAIL";
            const Icon = isEmail ? Mail : MessageSquare;
            return (
              <li key={n.id} className="px-5 py-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border ${
                      isEmail
                        ? "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-300"
                        : "bg-brand-red/10 border-brand-red/20 text-brand-red"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3 mb-0.5">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {n.subject}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                          statusStyle[n.status]
                        }`}
                      >
                        {n.status === "DELIVERED" && (
                          <CheckCircle2 className="h-3 w-3" />
                        )}
                        {n.status === "FAILED" && <XCircle className="h-3 w-3" />}
                        {n.status}
                      </span>
                    </div>
                    <p className="text-[12px] text-gray-700 dark:text-gray-200 line-clamp-2 leading-relaxed">
                      {n.body}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-gray-500 dark:text-gray-400">
                      <span className="font-semibold uppercase tracking-wider">
                        {n.channel}
                      </span>
                      <span>·</span>
                      <span>{n.recipient}</span>
                      {n.bookingReference && (
                        <>
                          <span>·</span>
                          <span className="font-mono">{n.bookingReference}</span>
                        </>
                      )}
                      <span>·</span>
                      <span>{format(parseISO(n.sentAt), "MMM d, yyyy h:mm a")}</span>
                      {n.providerResponse && (
                        <>
                          <span>·</span>
                          <span className="font-mono opacity-70">{n.providerResponse}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
