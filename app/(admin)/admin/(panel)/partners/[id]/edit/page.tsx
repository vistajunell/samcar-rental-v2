import { notFound } from "next/navigation";
import PartnerForm from "@/components/admin/PartnerForm";
import PageHeader from "@/components/admin/PageHeader";
import { getPartnerById } from "@/lib/queries/partners";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPartnerPage({ params }: Props) {
  const { id } = await params;
  const partner = await getPartnerById(id);
  if (!partner) notFound();

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Partners", href: "/admin/partners" },
          { label: partner.name, href: `/admin/partners/${partner.id}` },
          { label: "Edit" },
        ]}
        title={`Edit ${partner.name}`}
        subtitle="Update contact details, commission rate, and internal partner notes."
      />
      <PartnerForm mode="edit" partner={partner} />
    </div>
  );
}
