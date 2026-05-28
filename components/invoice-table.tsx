"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { UnifiedInvoice } from "@/lib/schemas/invoice";
import { cn } from "@/lib/utils";
import { formatCents, formatDate } from "@/lib/utils/format";

import type { SourceFilterValue } from "./source-filter";

interface InvoiceTableProps {
  invoices: UnifiedInvoice[];
  totalCount: number;
  sourceFilter: SourceFilterValue;
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength)}…`;
}

function sourceBadgeClass(source: UnifiedInvoice["source"]): string {
  if (source === "quickbooks") {
    return "border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300";
  }
  return "border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
}

function statusBadgeClass(status: UnifiedInvoice["status"]): string {
  switch (status) {
    case "paid":
      return "border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "open":
      return "border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    case "draft":
      return "border-border bg-muted text-muted-foreground";
    case "void":
      return "border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300";
    default:
      return "border-border bg-muted text-muted-foreground";
  }
}

function sourceLabel(source: SourceFilterValue): string {
  if (source === "quickbooks") {
    return "QuickBooks";
  }
  if (source === "xero") {
    return "Xero";
  }
  return "this source";
}

function emptyMessage(
  sourceFilter: SourceFilterValue,
  totalCount: number
): string {
  if (totalCount === 0) {
    return "No invoices found.";
  }
  if (sourceFilter === "all") {
    return "No invoices match the current filter.";
  }
  return `No invoices from ${sourceLabel(sourceFilter)}.`;
}

export function InvoiceTable({
  invoices,
  totalCount,
  sourceFilter,
}: InvoiceTableProps) {
  if (invoices.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">All invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-10 text-center text-sm text-muted-foreground">
            {emptyMessage(sourceFilter, totalCount)}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base font-semibold">All invoices</CardTitle>
        <p className="text-sm text-muted-foreground">
          Showing {invoices.length} of {totalCount}
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Source
              </TableHead>
              <TableHead className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Invoice #
              </TableHead>
              <TableHead className="hidden px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:table-cell">
                Vendor
              </TableHead>
              <TableHead className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Amount
              </TableHead>
              <TableHead className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Issue date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow
                key={invoice.id}
                className="hover:bg-muted/50"
              >
                <TableCell className="px-4 py-3">
                  <Badge
                    variant="outline"
                    className={cn("capitalize", sourceBadgeClass(invoice.source))}
                  >
                    {invoice.source}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 font-mono text-sm">
                  {invoice.invoice_number}
                </TableCell>
                <TableCell className="hidden max-w-[200px] truncate px-4 py-3 sm:table-cell">
                  {truncate(invoice.vendor.name, 30)}
                </TableCell>
                <TableCell className="px-4 py-3">
                  <Badge
                    variant="outline"
                    className={cn("capitalize", statusBadgeClass(invoice.status))}
                  >
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-right font-mono text-sm font-medium tabular-nums">
                  {formatCents(invoice.total_amount_cents, invoice.currency)}
                </TableCell>
                <TableCell className="px-4 py-3 text-right text-sm text-muted-foreground">
                  {formatDate(invoice.issue_date)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
