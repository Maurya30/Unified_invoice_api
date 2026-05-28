import { z } from "zod";

export const UnifiedInvoiceSchema = z.object({
  // Identity
  id: z.string(), // `${source}:${source_id}`
  source: z.enum(["quickbooks", "xero"]),
  source_id: z.string(),

  // Core fields
  invoice_number: z.string(),
  status: z.enum(["draft", "open", "paid", "void", "unknown"]),

  // Money — all amounts in cents to avoid float drift
  total_amount_cents: z.number().int(),
  currency: z.string().length(3), // ISO 4217

  // Dates — ISO 8601 strings (YYYY-MM-DD)
  issue_date: z.string(),
  due_date: z.string().nullable(),

  // Vendor
  vendor: z.object({
    name: z.string(),
    source_id: z.string(),
  }),

  // Line items
  line_items: z.array(
    z.object({
      description: z.string(),
      quantity: z.number(),
      unit_amount_cents: z.number().int(),
      total_amount_cents: z.number().int(),
    })
  ),

  // Provenance — raw payload kept for debugging
  raw: z.unknown().optional(),
});

export type UnifiedInvoice = z.infer<typeof UnifiedInvoiceSchema>;
