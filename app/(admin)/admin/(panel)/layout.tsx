import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { getAdminSession } from "@/lib/admin/session";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen flex bg-[#f7f7f7] dark:bg-[#050505]">
      <div className="hidden lg:block">
        <AdminSidebar variant="desktop" />
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        <AdminTopbar session={session} />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-7">{children}</main>
      </div>
    </div>
  );
}
