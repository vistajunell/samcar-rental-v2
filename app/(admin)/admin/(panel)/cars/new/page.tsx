import PageHeader from "@/components/admin/PageHeader";
import CarForm from "@/components/admin/CarForm";
import { getPartners } from "@/lib/queries/partners";

export default async function NewCarPage() {
  const partners = await getPartners();

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Cars", href: "/admin/cars" },
          { label: "New" },
        ]}
        title="Add Car"
        subtitle="Create a partner-confirmed inventory record for public publishing."
      />
      <div className="max-w-4xl">
        <CarForm mode="create" partners={partners} />
      </div>
    </div>
  );
}
