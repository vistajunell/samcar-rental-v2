import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { format, parseISO } from "date-fns";
import type { AdminInvoice } from "@/lib/queries/invoices";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    color: "#111827",
    fontFamily: "Helvetica",
  },
  topBar: {
    height: 4,
    backgroundColor: "#f41918",
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 18,
    marginBottom: 24,
  },
  brand: {
    fontSize: 9,
    letterSpacing: 1.8,
    color: "#f41918",
    fontWeight: 700,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
  },
  muted: {
    color: "#6b7280",
  },
  badge: {
    borderWidth: 1,
    borderColor: "#f41918",
    color: "#f41918",
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontSize: 9,
    fontWeight: 700,
    textTransform: "uppercase",
  },
  grid: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 24,
  },
  gridItem: {
    flex: 1,
  },
  label: {
    color: "#6b7280",
    fontSize: 8,
    letterSpacing: 1,
    textTransform: "uppercase",
    fontWeight: 700,
    marginBottom: 5,
  },
  strong: {
    fontWeight: 700,
  },
  table: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  th: {
    padding: 10,
    fontSize: 8,
    color: "#6b7280",
    letterSpacing: 1,
    textTransform: "uppercase",
    fontWeight: 700,
  },
  row: {
    flexDirection: "row",
  },
  td: {
    padding: 10,
  },
  description: {
    flex: 1,
  },
  amount: {
    width: 110,
    textAlign: "right",
  },
  totals: {
    alignSelf: "flex-end",
    width: 230,
    gap: 7,
    marginBottom: 22,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  grandTotal: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 8,
    fontSize: 12,
    fontWeight: 700,
  },
  red: {
    color: "#f41918",
  },
  notes: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 14,
    color: "#374151",
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
    color: "#6b7280",
    fontSize: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

const peso = (n: number) => `PHP ${n.toLocaleString()}`;

export default function InvoicePdfDocument({ invoice }: { invoice: AdminInvoice }) {
  return (
    <Document
      title={`${invoice.number} - SamCar Rental`}
      author="SamCar Rental Lucena PH"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.topBar} />
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>SamCar Rental Lucena PH</Text>
            <Text style={styles.title}>Invoice</Text>
            <Text style={styles.muted}>{invoice.number}</Text>
          </View>
          <View>
            <Text style={styles.badge}>{invoice.paymentStatus.replaceAll("_", " ")}</Text>
          </View>
        </View>

        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Bill to</Text>
            <Text style={styles.strong}>{invoice.customerName}</Text>
            <Text style={styles.muted}>{invoice.customerEmail}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Booking</Text>
            <Text style={styles.strong}>{invoice.bookingReference}</Text>
            <Text style={styles.muted}>
              Issued {format(parseISO(invoice.issuedAt), "MMM d, yyyy")} | Due{" "}
              {format(parseISO(invoice.dueDate), "MMM d, yyyy")}
            </Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, styles.description]}>Description</Text>
            <Text style={[styles.th, styles.amount]}>Amount</Text>
          </View>
          <View style={styles.row}>
            <View style={[styles.td, styles.description]}>
              <Text style={styles.strong}>Vehicle rental - {invoice.carLabel}</Text>
              <Text style={styles.muted}>
                {format(parseISO(invoice.rentalStart), "MMM d, h:mm a")} to{" "}
                {format(parseISO(invoice.rentalEnd), "MMM d, h:mm a, yyyy")}
              </Text>
              <Text style={styles.muted}>Pickup: {invoice.pickupAddress}</Text>
              <Text style={styles.muted}>Drop-off: {invoice.dropoffAddress}</Text>
            </View>
            <Text style={[styles.td, styles.amount, styles.strong]}>
              {peso(invoice.subtotal)}
            </Text>
          </View>
          {invoice.driverFee > 0 && (
            <View style={styles.row}>
              <Text style={[styles.td, styles.description]}>Driver fee</Text>
              <Text style={[styles.td, styles.amount, styles.strong]}>
                {peso(invoice.driverFee)}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.totals}>
          <TotalRow label="Subtotal" value={peso(invoice.subtotal)} />
          {invoice.driverFee > 0 && (
            <TotalRow label="Driver fee" value={peso(invoice.driverFee)} />
          )}
          <TotalRow label="Total" value={peso(invoice.total)} bold />
          <TotalRow label="Paid" value={peso(invoice.paid)} />
          <TotalRow label="Balance" value={peso(invoice.balance)} bold red />
        </View>

        {invoice.notes && (
          <View style={styles.notes}>
            <Text style={styles.label}>Notes</Text>
            <Text>{invoice.notes}</Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text>Generated by SamCar Rental V2</Text>
          <Text>{invoice.number}</Text>
        </View>
      </Page>
    </Document>
  );
}

function TotalRow({
  label,
  value,
  bold,
  red,
}: {
  label: string;
  value: string;
  bold?: boolean;
  red?: boolean;
}) {
  return (
    <View style={[styles.totalRow, bold ? styles.grandTotal : undefined]}>
      <Text>{label}</Text>
      <Text style={[bold ? styles.strong : undefined, red ? styles.red : undefined]}>
        {value}
      </Text>
    </View>
  );
}
