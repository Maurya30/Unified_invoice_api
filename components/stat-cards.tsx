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
}

export function StatCards({ invoices }: StatCardsProps) {
  const count = invoices.length;
  const totalCents = invoices.reduce(
    (sum, invoice) => sum + invoice.total_amount_cents,
    0
  );
  const currency = invoices[0]?.currency ?? "USD";

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardDescription>Total invoices</CardDescription>
          <CardTitle className="text-3xl">{count}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {count === 0 ? "0 invoices" : `${count} invoice${count === 1 ? "" : "s"}`}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Combined total</CardDescription>
          <CardTitle className="text-3xl">
            {formatCents(totalCents, currency)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Sum of visible invoices
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
