# PRD: Unified Invoice API

**Author:** Maurya
**Timeline:** ~6-8 focused hours over a weekend
**Demo target:** Agave on-campus event, June 3, 2026

---

## 1. The Pitch

A backend service that fetches invoices from two different accounting systems (QuickBooks Online + Xero) and exposes them through a single unified API, with a clean dashboard rendering combined results.

**Framing:** This is a learning artifact, not a product clone. It exists to viscerally understand the unification problem that Agave has solved at scale across 11+ construction ERPs.

---

## 2. Why This Exists

Agave's technical moat is 4+ years of unifying fragmented construction ERPs under a single API. This project attempts a baby version of that with 2 modern accounting systems to surface the real quirks (auth, pagination, schema mismatches, status mapping) and document them.

Explicit goal: build something I can demo in 60 seconds and talk about for 10+ minutes with their engineers.

---

## 3. Goals & Non-Goals

### Goals
- Single `GET /api/invoices` endpoint returning a unified invoice schema
- Real integrations with QuickBooks Online + Xero (no mocks for the core flow)
- Zod-validated unified schema
- Clean provider abstraction (interface) — adding a 3rd ERP should be obvious
- Polished dashboard with source attribution
- Deployed live on Vercel
- README with a "Things I Learned" section documenting real quirks

### Non-Goals
- Writing invoices back to either system (read-only)
- Multi-user auth / login flow (single dev account, tokens in `.env`)
- Database / persistence (refetch each request)
- Webhook / real-time sync
- Full pagination (first page only; noted as future work)
- Adding a 3rd ERP (architecture supports it, don't build it)
- Tests (noted as future work)

---

## 4. Technical Specification

### 4.1 Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict mode) |
| Validation | Zod |
| Styling | Tailwind CSS |
| UI components | shadcn/ui |
| Deployment | Vercel |
| Auth | OAuth tokens stored in `.env.local`, refreshed in provider code |

### 4.2 Architecture
Dashboard (Next.js page)
↓ fetch
/api/invoices (Next.js API route)
├─ Refresh tokens
├─ Parallel fetch via Promise.allSettled
├─ Normalize each response
├─ Validate with Zod
└─ Return { invoices, errors }
│
├──► QuickBooks Provider ──► QB Online Sandbox
└──► Xero Provider        ──► Xero Demo Company

### 4.3 Unified Invoice Schema

`lib/schemas/invoice.ts`:

```typescript
import { z } from 'zod';

export const UnifiedInvoiceSchema = z.object({
  // Identity
  id: z.string(),                          // `${source}:${source_id}`
  source: z.enum(['quickbooks', 'xero']),
  source_id: z.string(),

  // Core fields
  invoice_number: z.string(),
  status: z.enum(['draft', 'open', 'paid', 'void', 'unknown']),

  // Money — all amounts in cents to avoid float drift
  total_amount_cents: z.number().int(),
  currency: z.string().length(3),          // ISO 4217

  // Dates — ISO 8601 strings (YYYY-MM-DD)
  issue_date: z.string(),
  due_date: z.string().nullable(),

  // Vendor
  vendor: z.object({
    name: z.string(),
    source_id: z.string(),
  }),

  // Line items
  line_items: z.array(z.object({
    description: z.string(),
    quantity: z.number(),
    unit_amount_cents: z.number().int(),
    total_amount_cents: z.number().int(),
  })),

  // Provenance — raw payload kept for debugging
  raw: z.unknown().optional(),
});

export type UnifiedInvoice = z.infer<typeof UnifiedInvoiceSchema>;
```

**Design decisions:**
- **Money in cents (int)** to avoid float drift — industry standard
- **Composite `id`** (`${source}:${source_id}`) guarantees uniqueness across sources
- **`raw` field** kept for debugging and transparency
- **`status: 'unknown'`** as explicit fallback — fail loudly, not silently

### 4.4 Provider Interface

`lib/providers/types.ts`:

```typescript
import type { UnifiedInvoice } from '@/lib/schemas/invoice';

export interface InvoiceProvider {
  name: 'quickbooks' | 'xero';
  fetchInvoices(): Promise<UnifiedInvoice[]>;
}
```

Each provider:
1. Refreshes its OAuth access token using the refresh token from env
2. Hits the underlying API
3. Maps the response into `UnifiedInvoice[]`
4. Runs each through `UnifiedInvoiceSchema.parse()` (loud failures > silent ones)

### 4.5 The Endpoint

`app/api/invoices/route.ts` uses `Promise.allSettled` so one provider failing doesn't kill the whole response. Returns `{ invoices, errors }`.

### 4.6 File Structure
unified-invoice-api/
├── app/
│   ├── api/
│   │   └── invoices/
│   │       └── route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── lib/
│   ├── providers/
│   │   ├── types.ts
│   │   ├── quickbooks.ts
│   │   └── xero.ts
│   ├── schemas/
│   │   └── invoice.ts
│   └── utils/
│       └── format.ts
├── components/
│   ├── ui/                  # shadcn components
│   ├── invoice-table.tsx
│   ├── stat-cards.tsx
│   └── source-filter.tsx
├── .env.example
├── .env.local               # gitignored
├── PRD.md
└── README.md

---

## 5. Build Plan

### Saturday (~4 hours)
- **Hour 1:** Setup + design Unified Schema
- **Hour 2:** QuickBooks Online provider (sandbox)
- **Hour 3:** Xero provider (Demo Company)
- **Hour 4:** Combine + basic dashboard

### Sunday (~3-4 hours)
- **Hour 5:** UI polish (stat cards, source filter, badges, mobile-friendly)
- **Hour 6:** Deploy to Vercel
- **Hour 7:** Write README with "Things I Learned"
- **Hour 8 (buffer):** Demo prep

---

## 6. Definition of Done

- [ ] Live Vercel URL works on phone
- [ ] Returns real invoices from both QB and Xero
- [ ] Source filter works
- [ ] README has 5+ specific learned quirks
- [ ] GitHub repo is public
- [ ] 60-second elevator demo rehearsed

---

## 7. The Event Pitch

> "I read your pitch deck and got hooked on the unification problem — the slide about reverse-engineering Sage and decompiling binaries was wild. I wanted to feel the problem on a small scale, so I spent the weekend trying to unify just two systems: QuickBooks and Xero.
>
> [Show URL on phone]
>
> Here's the dashboard — invoices from both systems, one unified table. The interesting stuff is in the code: a Zod schema for the unified shape, a provider abstraction so adding a third system is just implementing one interface.
>
> A few things surprised me — [specific quirk]. Made me appreciate that you've done this 11 times over."
Save the file.
Step 5: Commit the PRD
In the terminal:
bashgit add PRD.md
git commit -m "Add PRD"
git push
Step 6: The Cursor plan-mode prompt
In Cursor, open the chat (Cmd+L or Cmd+I), switch to Plan mode (or Agent mode), and paste this:

PROMPT TO PASTE INTO CURSOR:
Read PRD.md in full before doing anything.

Then set up this project from scratch as a fresh Next.js 15 application in the current directory (which is empty except for PRD.md, README.md, .gitignore, and LICENSE from the GitHub init).

Plan and execute the following setup steps:

1. Initialize a Next.js 15 app in the current directory with:
   - TypeScript (strict mode)
   - Tailwind CSS
   - App Router
   - ESLint
   - src/ directory: NO (keep app/ at root for simplicity)
   - import alias: @/*

2. Install dependencies:
   - zod (for schema validation)

3. Initialize shadcn/ui with the "new-york" style, neutral base color, CSS variables: yes. Then add these components:
   - table
   - card
   - badge
   - button
   - alert
   - skeleton

4. Create the full file structure described in PRD section 4.6:
   - lib/schemas/invoice.ts — implement the UnifiedInvoiceSchema exactly as defined in PRD section 4.3, with all design comments
   - lib/providers/types.ts — implement the InvoiceProvider interface from PRD section 4.4
   - lib/providers/quickbooks.ts — stub file with a TODO for the QuickBooks integration; export a `quickbooks: InvoiceProvider` that throws "Not implemented" for now
   - lib/providers/xero.ts — same as above but for Xero
   - lib/utils/format.ts — helper functions: formatCents(cents, currency), formatDate(isoString)
   - app/api/invoices/route.ts — implement the GET handler using Promise.allSettled across both providers, returning { invoices, errors }. Since providers throw, it should currently return empty invoices + 2 errors.
   - components/invoice-table.tsx — placeholder client component using shadcn Table, accepts invoices prop
   - components/stat-cards.tsx — placeholder, accepts invoices prop, shows count and total
   - components/source-filter.tsx — placeholder, accepts current filter and onChange
   - app/page.tsx — fetches /api/invoices, renders stat-cards + source-filter + invoice-table
   - .env.example — list all env vars we'll need: QUICKBOOKS_CLIENT_ID, QUICKBOOKS_CLIENT_SECRET, QUICKBOOKS_REFRESH_TOKEN, QUICKBOOKS_REALM_ID, XERO_CLIENT_ID, XERO_CLIENT_SECRET, XERO_REFRESH_TOKEN, XERO_TENANT_ID

5. Update .gitignore to ensure .env.local is ignored (it should be already from Next.js init).

6. Update README.md with a placeholder for now — just include the project name, one-line description, "Status: in progress", and stack list. The full README will be written later.

7. Make sure `npm run dev` works cleanly with no errors. The page should load and show "0 invoices" with 2 errors visible in a banner (since the providers throw).

After setup, give me:
- A summary of what was created
- The exact next step I should take (which will be: get QuickBooks Online sandbox credentials)
- Confirmation that `npm run dev` runs cleanly

Do NOT implement the QuickBooks or Xero API calls yet. Stubs only. We'll do those one at a time after I get credentials.