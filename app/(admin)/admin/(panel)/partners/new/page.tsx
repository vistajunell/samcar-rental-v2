import PartnerForm from "@/components/admin/PartnerForm";
import PageHeader from "@/components/admin/PageHeader";

export default function NewPartnerPage() {
  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Partners", href: "/admin/partners" },
          { label: "New Partner" },
        ]}
        title="Add Partner"
        subtitle="Create a partner owner profile for commission-based inventory."
      />
      <PartnerForm mode="create" />
    </div>
  );
}
