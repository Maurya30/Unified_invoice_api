# Unified Invoice API

A small backend that fetches invoices from QuickBooks Online and Xero and exposes them through a single API + dashboard. Inspired by [Agave](https://www.useagave.com)'s work unifying 11+ construction ERPs under one schema.

**Live:** [unified-invoice-api.vercel.app](https://unified-invoice-api.vercel.app)
**Dashboard:** [unified-invoice-api.vercel.app/dashboard](https://unified-invoice-api.vercel.app/dashboard)

---

## Why this exists

Every accounting system invented its own way to represent an invoice. Field names disagree. Date formats disagree. Some systems have an explicit `status` field; some require you to derive it from balances. To build anything on top of multiple systems, you have to translate them into a common shape.

This project does that for two modern accounting APIs — QuickBooks Online and Xero — to understand the unification problem on a small scale. Agave does this for 11+ construction ERPs, including on-premise systems built decades ago with no public APIs. The goal here was not to replicate that work, but to feel a fraction of it.

---

## What it does

`GET /api/invoices` returns invoices from both QuickBooks Online and Xero, normalized into a single Zod-validated schema, with provider failures isolated so one bad upstream doesn't break the response.
Dashboard (/dashboard)
↓ GET /api/invoices
Unified Invoice API
├─ Refresh OAuth tokens
├─ Parallel fetch via Promise.allSettled
├─ Normalize each response
├─ Validate with Zod
└─ Return { invoices, errors }
├──► QuickBooks Provider ──► QuickBooks Sandbox
└──► Xero Provider        ──► Xero Demo Company

---

## The unified schema

```typescript
export const UnifiedInvoiceSchema = z.object({
  id: z.string(),                          // `${source}:${source_id}`
  source: z.enum(['quickbooks', 'xero']),
  source_id: z.string(),
  invoice_number: z.string(),
  status: z.enum(['draft', 'open', 'paid', 'void', 'unknown']),
  total_amount_cents: z.number().int(),    // cents avoid float drift
  currency: z.string().length(3),          // ISO 4217
  issue_date: z.string(),                  // ISO 8601
  due_date: z.string().nullable(),
  vendor: z.object({
    name: z.string(),
    source_id: z.string(),
  }),
  line_items: z.array(z.object({
    description: z.string(),
    quantity: z.number(),
    unit_amount_cents: z.number().int(),
    total_amount_cents: z.number().int(),
  })),
  raw: z.unknown().optional(),             // original payload for debugging
});
```

Three decisions worth defending:

- **Money in cents (int), not floats.** Floats drift; cents don't.
- **Composite IDs** (`quickbooks:130`, `xero:fee88eea-...`) guarantee uniqueness across providers without coordinating ID spaces.
- **`status: 'unknown'` as an explicit fallback.** Fail loudly when a provider's status doesn't map cleanly, rather than silently mislabeling.

---

## Provider abstraction

Each accounting system implements a single interface:

```typescript
export interface InvoiceProvider {
  name: 'quickbooks' | 'xero';
  fetchInvoices(): Promise<UnifiedInvoice[]>;
}
```

Adding a third system means writing one new file in `lib/providers/`. The route handler doesn't need to change.

---

## Things I learned

The interesting work was not in the happy path. It was in the quirks each provider takes for granted.

**1. QuickBooks has no `status` field on invoices.**
QB invoices don't store status directly. You derive it from `Balance` vs `TotalAmt`. If `Balance === 0`, the invoice is paid. Anything else is open. Xero, by contrast, has an explicit `Status` enum with six possible values (DRAFT, SUBMITTED, AUTHORISED, PAID, VOIDED, DELETED). Same domain concept, completely different API surface.

**2. Xero rotates refresh tokens on every call.**
Every refresh response from Xero contains a new refresh token that replaces the old one. The old one is invalidated immediately. Fail to persist the rotation and your integration silently dies after one refresh. QuickBooks doesn't do this — the refresh token is stable for 100 days.

**3. Microsoft JSON dates.**
Xero returns dates as `/Date(1748304000000+0000)/` — a legacy .NET serialization format that's essentially extinct in 2026. I had to write a small parser to extract the milliseconds and reformat to ISO. QuickBooks just uses `YYYY-MM-DD`.

**4. Tenant header vs URL path.**
Xero requires an `Xero-tenant-id` header on every API request because one OAuth connection can serve multiple organizations. QuickBooks couples one connection to one realm via the URL path (`/v3/company/{realmId}/...`). Two reasonable choices, two completely different client SDKs.

**5. SQL-style query language.**
Instead of REST query parameters, QuickBooks invented its own SQL-flavored query language: `SELECT * FROM Invoice MAXRESULTS 50`. Strange in 2026 but it's how the entire API surface works.

**6. Token lifetimes are not consistent.**
QuickBooks access tokens last 1 hour; refresh tokens 100 days. Xero access tokens last 30 minutes; refresh tokens 60 days (and rotate on every call). Same OAuth 2.0 spec, totally different operational characteristics.

**7. Vendor vs customer asymmetry.**
QuickBooks invoices are FROM your company TO a customer — the counterparty is a `CustomerRef`. The unified schema names that field `vendor` because in an AP-style abstraction the vendor is "the other party on the invoice." Reconciling the noun across schemas required choosing one and documenting why.

**8. OAuth scopes are mid-migration.**
Xero is deprecating broad scopes like `accounting.transactions.read` in favor of granular ones like `accounting.invoices.read`, with full migration by 2027. The auth URL needed updated scope strings or the consent screen would fail silently. API surfaces drift even at the auth layer.

---

## What's not in this

Honest scope. This is a learning artifact, not a product.

- **No persistence.** Invoices are re-fetched on every request. No database.
- **No write-back.** Read-only — no invoice creation, no updates.
- **First page only.** Real pagination is noted as future work but not implemented.
- **No webhooks.** Polling-only. Real-time sync is a separate hard problem.
- **No multi-user auth.** Tokens are stored in environment variables. A single developer connection per provider.
- **No tests.** A production version would have integration tests against mocked providers and contract tests against real sandboxes.
- **No rotated-token persistence.** Xero rotates refresh tokens on every call, but the demo doesn't write them back to env. The deployed version works for a short window before the token expires; production would persist rotated tokens to a KV store.

---

## What I'd build next

- Persist rotated Xero refresh tokens to Vercel KV or similar.
- Add a third provider with a meaningfully different API shape (Sage Intacct uses XML; Procore is more PM-shaped than ERP-shaped).
- Pagination — `cursor`-style for the unified API, mapped from each provider's pagination scheme.
- Webhooks for systems that have them; polling-based change detection for those that don't.
- Idempotency keys on the (future) write path.
- A small caching layer with TTL — most invoice queries are read-heavy and the underlying systems are slow.
- Integration tests against recorded sandbox fixtures.

---

## Stack

- Next.js 15 (App Router)
- TypeScript (strict)
- Zod for schema validation
- Tailwind CSS + shadcn/ui
- Deployed on Vercel

---

## Run locally

```bash
git clone https://github.com/Maurya30/Unified_invoice_api.git
cd Unified_invoice_api
npm install
cp .env.example .env.local
# Fill in the QuickBooks and Xero credentials (see .env.example)
npm run dev
```

The dashboard is at `http://localhost:3000/dashboard`. The API is at `http://localhost:3000/api/invoices`.

To get credentials:

- **QuickBooks Online:** [developer.intuit.com](https://developer.intuit.com) → create a sandbox app → use the OAuth Playground to get a refresh token.
- **Xero:** [developer.xero.com](https://developer.xero.com) → create a web app → run the auth URL manually, exchange the code for tokens via `curl` against `https://identity.xero.com/connect/token`, then call `/connections` to get a tenant ID.

---

## Credits

Built by [Maurya Panchal](https://www.linkedin.com/in/maurya-panchal-892b2424a/). Inspired by [Agave](https://www.useagave.com).

No real customer data — all values come from QuickBooks Sandbox and Xero's Demo Company.
