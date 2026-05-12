import { Plus, Radio, MapPin, WifiOff } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";

interface MockDevice {
  id: string;
  imei: string;
  carLabel: string;
  provider: string;
  status: "ONLINE" | "OFFLINE" | "UNASSIGNED";
}

const mockDevices: MockDevice[] = [
  {
    id: "g1",
    imei: "865784049012345",
    carLabel: "Toyota Veloz 2025",
    provider: "Concox JM-VL01",
    status: "ONLINE",
  },
  {
    id: "g2",
    imei: "865784049012346",
    carLabel: "Toyota Innova 2023",
    provider: "Concox JM-VL01",
    status: "OFFLINE",
  },
  {
    id: "g3",
    imei: "865784049012347",
    carLabel: "—",
    provider: "Teltonika FMC130",
    status: "UNASSIGNED",
  },
];

const statusStyle: Record<MockDevice["status"], string> = {
  ONLINE: "bg-green-500/15 border-green-500/30 text-green-700 dark:text-green-300",
  OFFLINE: "bg-gray-500/15 border-gray-500/30 text-gray-700 dark:text-gray-300",
  UNASSIGNED: "bg-yellow-500/15 border-yellow-500/30 text-yellow-700 dark:text-yellow-300",
};

export default function GpsPage() {
  return (
    <div>
      <PageHeader
        title="GPS Tracking"
        subtitle="Manage tracking devices and prepare for live vehicle telemetry."
        actions={
          <button
            type="button"
            className="shine-btn inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand-red hover:bg-deep-red text-white text-sm font-bold transition-colors"
          >
            <Plus className="relative z-[2] h-4 w-4" />
            <span className="relative z-[2]">Register Device</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* Map placeholder */}
        <section className="rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] overflow-hidden">
          <header className="px-5 py-4 border-b border-gray-100 dark:border-white/[.05]">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">
              Live Map
            </h2>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Real-time fleet positions will render here once a GPS provider is wired.
            </p>
          </header>
          <div className="relative h-[420px] flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#0a0a0a] dark:to-[#1a1a1a]">
            <div className="absolute inset-0 opacity-30 bg-[linear-gradient(rgba(244,25,24,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(244,25,24,0.18)_1px,transparent_1px)] bg-[size:48px_48px]" />
            <div className="relative text-center max-w-md px-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-red/10 border border-brand-red/30 mb-4">
                <MapPin className="h-7 w-7 text-brand-red" />
              </div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white">
                Map awaiting provider
              </h3>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                The schema (GpsDevice, GpsLocation) and admin registration UI are ready. Live
                coordinates will appear here once a provider key is configured.
              </p>
            </div>
          </div>
        </section>

        {/* Device list */}
        <aside className="rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[.05] overflow-hidden">
          <header className="px-5 py-4 border-b border-gray-100 dark:border-white/[.05]">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Radio className="h-4 w-4 text-brand-red" />
              Devices
            </h2>
          </header>
          <ul className="divide-y divide-gray-100 dark:divide-white/[.05]">
            {mockDevices.map((d) => (
              <li key={d.id} className="px-5 py-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-mono text-[11px] font-bold text-gray-900 dark:text-white">
                      {d.imei}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{d.provider}</p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider ${statusStyle[d.status]}`}
                  >
                    {d.status === "OFFLINE" && <WifiOff className="h-3 w-3" />}
                    {d.status}
                  </span>
                </div>
                <p className="text-xs text-gray-700 dark:text-gray-200">
                  {d.carLabel === "—" ? (
                    <span className="text-gray-400 italic">Not assigned</span>
                  ) : (
                    d.carLabel
                  )}
                </p>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
