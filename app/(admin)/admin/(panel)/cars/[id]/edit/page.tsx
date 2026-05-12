import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import CarForm from "@/components/admin/CarForm";
import { getAdminCarById } from "@/lib/queries/cars";
import { getPartners } from "@/lib/queries/partners";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCarPage({ params }: Props) {
  const { id } = await params;
  const [car, partners] = await Promise.all([
    getAdminCarById(id),
    getPartners(),
  ]);
  if (!car) notFound();

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Cars", href: "/admin/cars" },
          { label: `${car.brand} ${car.name}`, href: `/admin/cars/${car.id}` },
          { label: "Edit" },
        ]}
        title={`Edit ${car.brand} ${car.name}`}
        subtitle="Update partner assignment, public status, price, specs, and availability."
      />
      <div className="max-w-4xl">
        <CarForm mode="edit" car={car} partners={partners} />
      </div>
    </div>
  );
}
