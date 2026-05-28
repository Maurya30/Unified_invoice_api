import { NextResponse } from "next/server";

import { quickbooks } from "@/lib/providers/quickbooks";
import { xero } from "@/lib/providers/xero";

export async function GET() {
  const providers = [quickbooks, xero];
  const results = await Promise.allSettled(
    providers.map((provider) => provider.fetchInvoices())
  );

  const invoices = results.flatMap((result) =>
    result.status === "fulfilled" ? result.value : []
  );

  const errors = results
    .map((result, index) =>
      result.status === "rejected"
        ? {
            source: providers[index].name,
            message:
              result.reason instanceof Error
                ? result.reason.message
                : String(result.reason),
          }
        : null
    )
    .filter(
      (
        error
      ): error is { source: "quickbooks" | "xero"; message: string } =>
        error !== null
    );

  return NextResponse.json({ invoices, errors });
}
