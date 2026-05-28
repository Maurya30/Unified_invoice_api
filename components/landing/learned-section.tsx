const lessons = [
  {
    number: "01",
    title: "QuickBooks has no status field.",
    body: "QB invoices don't store status directly — you derive it from Balance vs TotalAmt. If Balance is zero, the invoice is paid. Anything else, it's open. Xero, by contrast, has an explicit Status enum with six possible values.",
  },
  {
    number: "02",
    title: "Xero rotates refresh tokens.",
    body: "Every refresh response from Xero contains a NEW refresh token that replaces the old one. The old one is invalidated immediately. Fail to persist the rotation and your integration silently dies after the first refresh. QuickBooks doesn't do this.",
  },
  {
    number: "03",
    title: "Microsoft JSON dates.",
    body: "Xero returns dates as /Date(1748304000000+0000)/ — a legacy .NET serialization format that's basically extinct in 2026. Had to write a custom parser. QuickBooks just uses ISO YYYY-MM-DD.",
  },
  {
    number: "04",
    title: "Tenant header vs URL path.",
    body: "Xero requires an Xero-tenant-id header on every request because one OAuth connection can serve multiple organizations. QuickBooks couples one connection to one realm via the URL path. Two valid choices, two completely different SDKs.",
  },
  {
    number: "05",
    title: "SQL-style query language.",
    body: "Instead of REST query params, QuickBooks invented its own SQL-flavored query language: SELECT * FROM Invoice MAXRESULTS 50. Feels strange in 2026 but it's how the entire API surface works.",
  },
  {
    number: "06",
    title: "Token lifetimes are not consistent.",
    body: "QuickBooks access tokens last 1 hour, refresh tokens 100 days. Xero access tokens last 30 minutes, refresh tokens 60 days. Same OAuth 2.0 spec, totally different operational characteristics.",
  },
  {
    number: "07",
    title: "Vendor vs customer asymmetry.",
    body: "QuickBooks invoices are FROM your company TO a customer, so the counterparty is the customer object. In an AP-style unified schema, the vendor is conceptually the counterparty — but it's a customer in QB and a contact in Xero. The schema had to abstract over that.",
  },
  {
    number: "08",
    title: "OAuth scopes are mid-migration.",
    body: "Xero is deprecating broad scopes like accounting.transactions.read in favor of granular ones like accounting.invoices.read, full migration by 2027. The auth URL needed updated scope strings or it would fail silently. API surfaces drift even at the auth layer.",
  },
];

export function LearnedSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Things I learned
        </p>
        <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
          Eight surprises from a weekend of API archeology.
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          The interesting stuff isn&apos;t in the happy path — it&apos;s in the
          quirks each provider takes for granted.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {lessons.map((lesson) => (
            <article
              key={lesson.number}
              className="rounded-2xl border border-border bg-card p-6 transition-colors duration-200 hover:border-primary/30"
            >
              <span className="font-mono text-sm font-semibold text-primary">
                {lesson.number}
              </span>
              <h3 className="mt-3 text-lg font-bold tracking-tight">
                {lesson.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {lesson.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
