// TODO: implement QuickBooks Online integration
// - Refresh access token using QUICKBOOKS_REFRESH_TOKEN
// - GET /v3/company/{realmId}/query?query=SELECT * FROM Invoice
// - Map to UnifiedInvoice[] and validate with UnifiedInvoiceSchema.parse

import type { InvoiceProvider } from "./types";

export const quickbooks: InvoiceProvider = {
  name: "quickbooks",
  async fetchInvoices() {
    throw new Error("Not implemented");
  },
};
