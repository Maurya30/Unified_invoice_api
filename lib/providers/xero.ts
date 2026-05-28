// TODO: implement Xero integration
// - Refresh access token using XERO_REFRESH_TOKEN
// - GET /api.xro/2.0/Invoices
// - Map to UnifiedInvoice[] and validate with UnifiedInvoiceSchema.parse

import type { InvoiceProvider } from "./types";

export const xero: InvoiceProvider = {
  name: "xero",
  async fetchInvoices() {
    throw new Error("Not implemented");
  },
};
