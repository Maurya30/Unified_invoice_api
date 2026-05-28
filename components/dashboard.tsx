"use client";

import { useMemo, useState } from "react";

import { InvoiceTable } from "@/components/invoice-table";
import {
  SourceFilter,
  type SourceFilterValue,
} from "@/components/source-filter";
import { StatCards } from "@/components/stat-cards";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { UnifiedInvoice } from "@/lib/schemas/invoice";
import { cn } from "@/lib/utils";

interface ProviderError {
  source: string;
  message: string;
}

interface DashboardProps {
  invoices: UnifiedInvoice[];
  errors: ProviderError[];
}

const PROVIDERS = [
  { id: "quickbooks" as const, label: "QuickBooks" },
  { id: "xero" as const, label: "Xero" },
];

function ProviderStatus({ errors }: { errors: ProviderError[] }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-4">
      {PROVIDERS.map((provider) => {
        const error = errors.find((e) => e.source === provider.id);
        const connected = !error;

        return (
          <div
            key={provider.id}
            className="flex min-w-0 items-start gap-2 text-sm"
          >
            <span
              className={cn(
                "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                connected ? "bg-green-500" : "bg-red-500"
              )}
              aria-hidden
            />
            <span className="min-w-0 text-muted-foreground">
              <span className="font-medium text-foreground">
                {provider.label}:
              </span>{" "}
              {connected ? (
                "connected"
              ) : (
                <span className="text-red-600 dark:text-red-400">
                  {error.message}
                </span>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function Dashboard({ invoices, errors }: DashboardProps) {
  const [sourceFilter, setSourceFilter] = useState<SourceFilterValue>("all");

  const counts = useMemo(
    () => ({
      all: invoices.length,
      quickbooks: invoices.filter((i) => i.source === "quickbooks").length,
      xero: invoices.filter((i) => i.source === "xero").length,
    }),
    [invoices]
  );

  const filteredInvoices = useMemo(() => {
    if (sourceFilter === "all") {
      return invoices;
    }
    return invoices.filter((invoice) => invoice.source === sourceFilter);
  }, [invoices, sourceFilter]);

  const providersConnected = PROVIDERS.length - errors.length;
  const bothProvidersFailed =
    errors.length >= PROVIDERS.length && invoices.length === 0;
  const showGlobalEmpty =
    invoices.length === 0 && errors.length === 0 && !bothProvidersFailed;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6 md:gap-8 md:p-8">
      <header className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Unified Invoice API
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Invoices from QuickBooks Online and Xero in one dashboard.
            </p>
          </div>
          <a
            href="https://github.com/Maurya30/Unified_invoice_api"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-sm text-muted-foreground underline-offset-4 transition-colors duration-200 hover:text-foreground hover:underline"
          >
            View on GitHub
          </a>
        </div>
        <ProviderStatus errors={errors} />
      </header>

      {bothProvidersFailed && (
        <Alert variant="destructive">
          <AlertTitle>Unable to load invoices</AlertTitle>
          <AlertDescription>
            Both QuickBooks and Xero failed to respond. Check your credentials
            in <code className="text-xs">.env.local</code> and try again.
          </AlertDescription>
        </Alert>
      )}

      {showGlobalEmpty && (
        <div className="rounded-lg border border-dashed py-16 text-center">
          <p className="text-sm text-muted-foreground">No invoices found.</p>
        </div>
      )}

      {!showGlobalEmpty && !bothProvidersFailed && (
        <>
          <StatCards
            invoices={filteredInvoices}
            providersConnected={providersConnected}
          />

          <div className="space-y-4">
            <SourceFilter
              value={sourceFilter}
              onChange={setSourceFilter}
              counts={counts}
            />
            <InvoiceTable
              invoices={filteredInvoices}
              totalCount={invoices.length}
              sourceFilter={sourceFilter}
            />
          </div>
        </>
      )}

      <footer className="mt-16 text-center">
        <p className="text-xs text-muted-foreground">
          Built by Maurya · A small experiment in API unification
        </p>
      </footer>
    </div>
  );
}
