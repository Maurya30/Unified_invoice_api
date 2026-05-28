import type { UnifiedInvoice } from "@/lib/schemas/invoice";

export interface InvoiceProvider {
  name: "quickbooks" | "xero";
  fetchInvoices(): Promise<UnifiedInvoice[]>;
}
