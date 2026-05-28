"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { UnifiedInvoice } from "@/lib/schemas/invoice";
import { formatCents } from "@/lib/utils/format";

interface StatCardsProps {
  invoices: UnifiedInvoice[];
  providersConnected: number;
  totalProviders?: number;
}

export function StatCards({
  invoices,
  providersConnected,
  totalProviders = 2,
}: StatCardsProps) {
  const count = invoices.length;
  const totalCents = invoices.reduce(
    (sum, invoice) => sum + invoice.total_amount_cents,
    0
  );
  const currency = invoices[0]?.currency ?? "USD";

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Card className="p-4">
        <CardHeader className="space-y-1 p-0">
          <CardDescription className="text-xs">Total invoices</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {count}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 pt-2">
          <p className="text-xs text-muted-foreground">
            {count === 0 ? "No invoices loaded" : "Across active filters"}
          </p>
        </CardContent>
      </Card>

      <Card className="p-4">
        <CardHeader className="space-y-1 p-0">
          <CardDescription className="text-xs">Combined total</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {formatCents(totalCents, currency)}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 pt-2">
          <p className="text-xs text-muted-foreground">
            Sum of visible invoices
          </p>
        </CardContent>
      </Card>

      <Card className="p-4">
        <CardHeader className="space-y-1 p-0">
          <CardDescription className="text-xs">Providers connected</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {providersConnected} of {totalProviders}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 pt-2">
          <p className="text-xs text-muted-foreground">
            QuickBooks + Xero integrations
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
