"use client";

import { useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";

import { InvoiceTable } from "@/components/invoice-table";
import { SourceFilter, type SourceFilterValue } from "@/components/source-filter";
import { StatCards } from "@/components/stat-cards";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { UnifiedInvoice } from "@/lib/schemas/invoice";

interface ProviderError {
  source: string;
  message: string;
}

interface DashboardProps {
  invoices: UnifiedInvoice[];
  errors: ProviderError[];
}

export function Dashboard({ invoices, errors }: DashboardProps) {
  const [sourceFilter, setSourceFilter] = useState<SourceFilterValue>("all");

  const filteredInvoices = useMemo(() => {
    if (sourceFilter === "all") {
      return invoices;
    }
    return invoices.filter((invoice) => invoice.source === sourceFilter);
  }, [invoices, sourceFilter]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6 md:p-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Unified Invoice API</h1>
        <p className="text-muted-foreground">
          Invoices from QuickBooks Online and Xero in one dashboard.
        </p>
      </header>

      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error) => (
            <Alert key={error.source} variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{error.source} provider error</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      <StatCards invoices={filteredInvoices} />
      <SourceFilter value={sourceFilter} onChange={setSourceFilter} />
      <InvoiceTable invoices={filteredInvoices} />
    </div>
  );
}
