import { headers } from "next/headers";

import { Dashboard } from "@/components/dashboard";
import type { UnifiedInvoice } from "@/lib/schemas/invoice";

interface InvoicesResponse {
  invoices: UnifiedInvoice[];
  errors: { source: string; message: string }[];
}

async function getInvoices(): Promise<InvoicesResponse> {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  const baseUrl = `${protocol}://${host}`;

  const response = await fetch(`${baseUrl}/api/invoices`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch invoices: ${response.status}`);
  }

  return response.json();
}

export default async function Home() {
  const { invoices, errors } = await getInvoices();

  return <Dashboard invoices={invoices} errors={errors} />;
}
