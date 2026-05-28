import { ZodError } from "zod";

import {
  UnifiedInvoiceSchema,
  type UnifiedInvoice,
} from "@/lib/schemas/invoice";

import type { InvoiceProvider } from "./types";

const TOKEN_URL = "https://identity.xero.com/connect/token";
const API_BASE = "https://api.xero.com";

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

interface XeroContact {
  ContactID?: string;
  Name?: string;
}

interface XeroLineItem {
  Description?: string;
  Quantity?: number;
  UnitAmount?: number;
  LineAmount?: number;
}

interface XeroInvoice {
  InvoiceID: string;
  InvoiceNumber?: string;
  Status?: string;
  Total: number;
  CurrencyCode: string;
  Date?: string | null;
  DueDate?: string | null;
  Contact?: XeroContact;
  LineItems?: XeroLineItem[];
}

interface XeroInvoicesResponse {
  Invoices?: XeroInvoice[];
}

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// In production we'd cache the access token for ~25 min and persist rotated refresh tokens.
// IMPORTANT: Xero ROTATES refresh tokens — every refresh returns a NEW refresh_token and the
// old one is invalidated. For this demo we only log a warning if rotation is detected.
async function refreshAccessToken(): Promise<string> {
  console.log("[xero] Refreshing access token...");

  const clientId = getEnv("XERO_CLIENT_ID");
  const clientSecret = getEnv("XERO_CLIENT_SECRET");
  const refreshToken = getEnv("XERO_REFRESH_TOKEN");

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
    throw new Error(`Xero token refresh failed: ${response.status} ${body}`);
  }

  const data = JSON.parse(body) as TokenResponse;

  if (data.refresh_token && data.refresh_token !== refreshToken) {
    console.warn(
      "[xero] Refresh token rotated by Xero (expected). For this demo we are NOT persisting the new refresh_token."
    );
  }

  return data.access_token;
}

// Xero returns dates as Microsoft JSON date format: "/Date(1234567890000+0000)/"
// It's unusual in 2026, but still shows up in some legacy APIs.
function parseXeroDate(xeroDate: string | null | undefined): string | null {
  if (!xeroDate) {
    return null;
  }

  const match = /\/Date\((\d+)/.exec(xeroDate);
  if (!match) {
    return null;
  }

  const ms = Number(match[1]);
  if (!Number.isFinite(ms)) {
    return null;
  }

  return new Date(ms).toISOString().slice(0, 10);
}

// Xero HAS a Status field — unlike QuickBooks which had to be derived from Balance vs TotalAmt
function mapStatus(xeroStatus: string): UnifiedInvoice["status"] {
  switch (xeroStatus) {
    case "DRAFT":
    case "SUBMITTED":
      return "draft";
    case "AUTHORISED":
      return "open";
    case "PAID":
      return "paid";
    case "VOIDED":
    case "DELETED":
      return "void";
    default:
      return "unknown";
  }
}

function mapToUnified(xeroInvoice: XeroInvoice): UnifiedInvoice {
  const sourceId = String(xeroInvoice.InvoiceID);

  const mapped: UnifiedInvoice = {
    id: `xero:${sourceId}`,
    source: "xero",
    source_id: sourceId,
    invoice_number: xeroInvoice.InvoiceNumber ?? sourceId,
    status: mapStatus(xeroInvoice.Status ?? ""),
    total_amount_cents: Math.round((xeroInvoice.Total ?? 0) * 100),
    // Xero supports multi-currency natively; CurrencyCode is the 3-letter ISO 4217 code.
    currency: xeroInvoice.CurrencyCode,
    issue_date: parseXeroDate(xeroInvoice.Date) ?? "",
    due_date: parseXeroDate(xeroInvoice.DueDate),
    vendor: {
      name: xeroInvoice.Contact?.Name ?? "Unknown",
      source_id: xeroInvoice.Contact?.ContactID ?? "",
    },
    line_items: (xeroInvoice.LineItems ?? []).map((line) => ({
      description: line.Description ?? "",
      quantity: line.Quantity ?? 1,
      unit_amount_cents: Math.round((line.UnitAmount ?? 0) * 100),
      total_amount_cents: Math.round((line.LineAmount ?? 0) * 100),
    })),
    raw: xeroInvoice,
  };

  try {
    return UnifiedInvoiceSchema.parse(mapped);
  } catch (error) {
    if (error instanceof ZodError) {
      console.error(
        `[xero] Validation failed for invoice ${mapped.id}:`,
        error.message
      );
      console.error(
        "[xero] Raw invoice:",
        JSON.stringify(xeroInvoice, null, 2)
      );
      throw new Error(
        `Xero invoice ${mapped.id} failed validation: ${error.message}`
      );
    }
    throw error;
  }
}

async function fetchXeroInvoices(accessToken: string): Promise<XeroInvoice[]> {
  const tenantId = getEnv("XERO_TENANT_ID");

  // Xero requires the Xero-tenant-id header because one OAuth connection can have multiple tenants.
  // For this demo we hardcode a single tenant from env.
  const url = `${API_BASE}/api.xro/2.0/Invoices?Statuses=AUTHORISED,PAID&page=1`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Xero-tenant-id": tenantId,
      Accept: "application/json",
    },
  });

  const body = await response.text();

  if (!response.ok) {
    throw new Error(`Xero fetch failed: ${response.status} ${body}`);
  }

  const data = JSON.parse(body) as XeroInvoicesResponse;
  return data.Invoices ?? [];
}

export const xero: InvoiceProvider = {
  name: "xero",
  async fetchInvoices() {
    const accessToken = await refreshAccessToken();
    console.log("[xero] Got access token, fetching invoices...");

    const invoices = await fetchXeroInvoices(accessToken);
    console.log(`[xero] Fetched ${invoices.length} invoices from Xero`);

    const unified = invoices.map(mapToUnified);
    console.log(`[xero] Mapped ${unified.length} invoices to UnifiedInvoice`);

    return unified;
  },
};
