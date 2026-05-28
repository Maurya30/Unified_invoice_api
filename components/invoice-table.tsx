"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { UnifiedInvoice } from "@/lib/schemas/invoice";
import { formatCents, formatDate } from "@/lib/utils/format";

interface InvoiceTableProps {
  invoices: UnifiedInvoice[];
}

export function InvoiceTable({ invoices }: InvoiceTableProps) {
  if (invoices.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        No invoices yet.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Source</TableHead>
          <TableHead>Invoice #</TableHead>
          <TableHead>Vendor</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Issue date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>
              <Badge variant="secondary">{invoice.source}</Badge>
            </TableCell>
            <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
            <TableCell>{invoice.vendor.name}</TableCell>
            <TableCell>
              <Badge variant="outline">{invoice.status}</Badge>
            </TableCell>
            <TableCell>
              {formatCents(invoice.total_amount_cents, invoice.currency)}
            </TableCell>
            <TableCell>{formatDate(invoice.issue_date)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
