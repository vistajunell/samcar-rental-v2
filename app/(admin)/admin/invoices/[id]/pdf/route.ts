import { notFound, redirect } from "next/navigation";
import { createElement } from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import InvoicePdfDocument from "@/lib/invoices/InvoicePdfDocument";
import { getAdminSession } from "@/lib/admin/session";
import { getInvoiceById } from "@/lib/queries/invoices";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: Params) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const invoice = await getInvoiceById(id);
  if (!invoice) notFound();

  const pdfElement = createElement(InvoicePdfDocument, { invoice });
  const buffer = await renderToBuffer(pdfElement as never);
  const fileName = `${invoice.number.replace(/[^a-z0-9-]/gi, "_")}.pdf`;

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
