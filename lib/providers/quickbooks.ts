import { ZodError } from "zod";

import {
  UnifiedInvoiceSchema,
  type UnifiedInvoice,
} from "@/lib/schemas/invoice";

import type { InvoiceProvider } from "./types";

const TOKEN_URL = "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer";
const SANDBOX_API_BASE = "https://sandbox-quickbooks.api.intuit.com";

interface QBRef {
  value?: string;
  name?: string;
}

interface QBLine {
  Id?: string;
  LineNum?: number;
  Description?: string;
  Amount?: number;
  DetailType?: string;
  SalesItemLineDetail?: {
    Qty?: number;
    UnitPrice?: number;
  };
}

interface QBInvoice {
  Id: string;
  DocNumber?: string;
  TxnDate: string;
  DueDate?: string;
  TotalAmt: number;
  Balance: number;
  CurrencyRef?: QBRef;
  CustomerRef?: QBRef;
  Line?: QBLine[];
}

interface QBQueryResponse {
  QueryResponse?: {
    Invoice?: QBInvoice | QBInvoice[];
    totalCount?: number;
  };
}

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  x_refresh_token_expires_in: number;
}

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// In production we'd cache the access token for ~55 min and persist rotated refresh tokens.
async function refreshAccessToken(): Promise<string> {
  console.log("[quickbooks] Refreshing access token...");

  const clientId = getEnv("QUICKBOOKS_CLIENT_ID");
  const clientSecret = getEnv("QUICKBOOKS_CLIENT_SECRET");
  const refreshToken = getEnv("QUICKBOOKS_REFRESH_TOKEN");

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  const body = await response.text();

  if (!response.ok) {
    throw new Error(
      `QuickBooks token refresh failed: ${response.status} ${body}`
    );
  }

  const data = JSON.parse(body) as TokenResponse;
  return data.access_token;
}

// QB has no single 'status' field — derived from Balance vs TotalAmt
function deriveStatus(balance: number, totalAmt: number): UnifiedInvoice["status"] {
  if (balance === 0) {
    return "paid";
  }
  if (balance > 0 && balance < totalAmt) {
    return "open";
  }
  if (balance === totalAmt) {
    return "open";
  }
  return "unknown";
}

function mapLineItems(lines: QBLine[] | undefined): UnifiedInvoice["line_items"] {
  if (!lines?.length) {
    return [];
  }

  return lines
    .filter((line) => line.DetailType !== "SubTotalLineDetail")
    .map((line) => ({
      description: line.Description ?? "",
      quantity: line.SalesItemLineDetail?.Qty ?? 1,
      unit_amount_cents: Math.round(
        (line.SalesItemLineDetail?.UnitPrice ?? line.Amount ?? 0) * 100
      ),
      total_amount_cents: Math.round((line.Amount ?? 0) * 100),
    }));
}

function mapToUnified(qbInvoice: QBInvoice): UnifiedInvoice {
  const sourceId = String(qbInvoice.Id);

  // QB invoices bill customers (CustomerRef), not vendors. We map the customer as the
  // counterparty "vendor" in our unified schema — an intentional asymmetry for this demo.
  const mapped: UnifiedInvoice = {
    id: `quickbooks:${sourceId}`,
    source: "quickbooks",
    source_id: sourceId,
    invoice_number: qbInvoice.DocNumber ?? sourceId,
    status: deriveStatus(qbInvoice.Balance, qbInvoice.TotalAmt),
    total_amount_cents: Math.round(qbInvoice.TotalAmt * 100),
    currency: qbInvoice.CurrencyRef?.value ?? "USD",
    issue_date: qbInvoice.TxnDate,
    due_date: qbInvoice.DueDate ?? null,
    vendor: {
      name: qbInvoice.CustomerRef?.name ?? "Unknown",
      source_id: qbInvoice.CustomerRef?.value ?? "",
    },
    line_items: mapLineItems(qbInvoice.Line),
    raw: qbInvoice,
  };

  try {
    return UnifiedInvoiceSchema.parse(mapped);
  } catch (error) {
    if (error instanceof ZodError) {
      console.error(
        `[quickbooks] Validation failed for invoice ${mapped.id}:`,
        error.message
      );
      console.error("[quickbooks] Raw invoice:", JSON.stringify(qbInvoice, null, 2));
      throw new Error(
        `QuickBooks invoice ${mapped.id} failed validation: ${error.message}`
      );
    }
    throw error;
  }
}

async function fetchQBInvoices(accessToken: string): Promise<QBInvoice[]> {
  const realmId = getEnv("QUICKBOOKS_REALM_ID");
  const query = "SELECT * FROM Invoice MAXRESULTS 50";
  const url = `${SANDBOX_API_BASE}/v3/company/${realmId}/query?query=${encodeURIComponent(query)}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  const body = await response.text();

  if (!response.ok) {
    throw new Error(`QuickBooks fetch failed: ${response.status} ${body}`);
  }

  const data = JSON.parse(body) as QBQueryResponse;
  const invoiceField = data.QueryResponse?.Invoice;

  if (!invoiceField) {
    return [];
  }

  return Array.isArray(invoiceField) ? invoiceField : [invoiceField];
}

export const quickbooks: InvoiceProvider = {
  name: "quickbooks",
  async fetchInvoices() {
    const accessToken = await refreshAccessToken();

    console.log("[quickbooks] Got access token, fetching invoices...");

    const qbInvoices = await fetchQBInvoices(accessToken);
    console.log(`[quickbooks] Fetched ${qbInvoices.length} invoices from QB`);

    const unified = qbInvoices.map(mapToUnified);
    console.log(`[quickbooks] Mapped ${unified.length} invoices to UnifiedInvoice`);

    return unified;
  },
};
