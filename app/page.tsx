import Link from "next/link";

import { ArchitectureDiagram } from "@/components/landing/architecture-diagram";
import { CodeBlock } from "@/components/landing/code-block";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNav } from "@/components/landing/landing-nav";
import { LearnedSection } from "@/components/landing/learned-section";
import { Button } from "@/components/ui/button";

const GITHUB_URL = "https://github.com/Maurya30/Unified_invoice_api";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden py-20 md:py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/40 to-transparent dark:from-primary/5 dark:to-transparent" />
          <div className="relative mx-auto max-w-6xl px-6 md:px-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              A weekend experiment
            </p>
            <h1 className="mt-4 max-w-4xl text-5xl font-bold tracking-tight md:text-6xl">
              One invoice schema. Two accounting APIs.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              A small exploration of the unification problem — inspired by
              Agave&apos;s work unifying 11+ construction ERPs into a single API.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                asChild
                className="h-11 rounded-lg bg-primary px-6 text-primary-foreground transition-colors duration-200 hover:bg-[#0052cc] dark:hover:bg-[#6ba0ff]"
              >
                <Link href="/dashboard">See the live dashboard →</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-lg transition-colors duration-200"
              >
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View source on GitHub
                </a>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Built by Maurya · Demo data from QuickBooks Sandbox + Xero Demo
              Company
            </p>
          </div>
        </section>

        {/* The problem */}
        <section className="py-20 md:py-32">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              The problem
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              The same invoice, modeled in two completely different ways.
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              Every accounting system invented its own way to represent an
              invoice. Field names disagree. Date formats disagree. Some have a
              &quot;status&quot; field, some don&apos;t. To build anything on top
              of multiple systems, you have to translate them into a common
              shape.
            </p>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <CodeBlock title="QuickBooks Online">
                <span className="text-foreground">{"{"}</span>
                {"\n  "}
                <span className="text-blue-600 dark:text-blue-400">
                  &quot;Id&quot;
                </span>
                <span className="text-foreground">: </span>
                <span className="text-green-600 dark:text-green-400">
                  &quot;130&quot;
                </span>
                <span className="text-foreground">,</span>
                {"\n  "}
                <span className="text-blue-600 dark:text-blue-400">
                  &quot;DocNumber&quot;
                </span>
                <span className="text-foreground">: </span>
                <span className="text-green-600 dark:text-green-400">
                  &quot;1037&quot;
                </span>
                <span className="text-foreground">,</span>
                {"\n  "}
                <span className="text-blue-600 dark:text-blue-400">
                  &quot;TxnDate&quot;
                </span>
                <span className="text-foreground">: </span>
                <span className="text-green-600 dark:text-green-400">
                  &quot;2026-05-02&quot;
                </span>
                <span className="text-foreground">,</span>
                {"\n  "}
                <span className="text-blue-600 dark:text-blue-400">
                  &quot;TotalAmt&quot;
                </span>
                <span className="text-foreground">: </span>
                <span className="text-amber-600 dark:text-amber-400">362.07</span>
                <span className="text-foreground">,</span>
                {"\n  "}
                <span className="text-blue-600 dark:text-blue-400">
                  &quot;Balance&quot;
                </span>
                <span className="text-foreground">: </span>
                <span className="text-amber-600 dark:text-amber-400">362.07</span>
                <span className="text-foreground">,</span>
                {"\n  "}
                <span className="text-blue-600 dark:text-blue-400">
                  &quot;CustomerRef&quot;
                </span>
                <span className="text-foreground">: {"{"}</span>
                {"\n    "}
                <span className="text-blue-600 dark:text-blue-400">
                  &quot;value&quot;
                </span>
                <span className="text-foreground">: </span>
                <span className="text-green-600 dark:text-green-400">
                  &quot;24&quot;
                </span>
                <span className="text-foreground">,</span>
                {"\n    "}
                <span className="text-blue-600 dark:text-blue-400">
                  &quot;name&quot;
                </span>
                <span className="text-foreground">: </span>
                <span className="text-green-600 dark:text-green-400">
                  &quot;Sonnenschein Family Store&quot;
                </span>
                {"\n  "}
                <span className="text-foreground">{"}"}</span>
                <span className="text-foreground">,</span>
                {"\n  "}
                <span className="text-blue-600 dark:text-blue-400">
                  &quot;CurrencyRef&quot;
                </span>
                <span className="text-foreground">: {"{"} </span>
                <span className="text-blue-600 dark:text-blue-400">
                  &quot;value&quot;
                </span>
                <span className="text-foreground">: </span>
                <span className="text-green-600 dark:text-green-400">
                  &quot;USD&quot;
                </span>
                <span className="text-foreground"> {"}"}</span>
                {"\n  "}
                <span className="text-muted-foreground">
                  {"// No status field — must derive"}
                </span>
                {"\n  "}
                <span className="text-muted-foreground">
                  {"// from Balance vs TotalAmt"}
                </span>
                {"\n"}
                <span className="text-foreground">{"}"}</span>
              </CodeBlock>

              <CodeBlock title="Xero">
                <span className="text-foreground">{"{"}</span>
                {"\n  "}
                <span className="text-blue-600 dark:text-blue-400">
                  &quot;InvoiceID&quot;
                </span>
                <span className="text-foreground">: </span>
                <span className="text-green-600 dark:text-green-400">
                  &quot;fee88eea-f2aa-4a71-a372-33d6d83d3c45&quot;
                </span>
                <span className="text-foreground">,</span>
                {"\n  "}
                <span className="text-blue-600 dark:text-blue-400">
                  &quot;InvoiceNumber&quot;
                </span>
                <span className="text-foreground">: </span>
                <span className="text-green-600 dark:text-green-400">
                  &quot;INV-0027&quot;
                </span>
                <span className="text-foreground">,</span>
                {"\n  "}
                <span className="text-blue-600 dark:text-blue-400">
                  &quot;Date&quot;
                </span>
                <span className="text-foreground">: </span>
                <span className="text-green-600 dark:text-green-400">
                  &quot;/Date(1748304000000+0000)/&quot;
                </span>
                <span className="text-foreground">,</span>
                {"\n  "}
                <span className="text-blue-600 dark:text-blue-400">
                  &quot;Total&quot;
                </span>
                <span className="text-foreground">: </span>
                <span className="text-amber-600 dark:text-amber-400">396.00</span>
                <span className="text-foreground">,</span>
                {"\n  "}
                <span className="text-blue-600 dark:text-blue-400">
                  &quot;Status&quot;
                </span>
                <span className="text-foreground">: </span>
                <span className="text-green-600 dark:text-green-400">
                  &quot;AUTHORISED&quot;
                </span>
                <span className="text-foreground">,</span>
                {"\n  "}
                <span className="text-blue-600 dark:text-blue-400">
                  &quot;Contact&quot;
                </span>
                <span className="text-foreground">: {"{"}</span>
                {"\n    "}
                <span className="text-blue-600 dark:text-blue-400">
                  &quot;ContactID&quot;
                </span>
                <span className="text-foreground">: </span>
                <span className="text-green-600 dark:text-green-400">
                  &quot;...&quot;
                </span>
                <span className="text-foreground">,</span>
                {"\n    "}
                <span className="text-blue-600 dark:text-blue-400">
                  &quot;Name&quot;
                </span>
                <span className="text-foreground">: </span>
                <span className="text-green-600 dark:text-green-400">
                  &quot;Ridgeway University&quot;
                </span>
                {"\n  "}
                <span className="text-foreground">{"}"}</span>
                <span className="text-foreground">,</span>
                {"\n  "}
                <span className="text-blue-600 dark:text-blue-400">
                  &quot;CurrencyCode&quot;
                </span>
                <span className="text-foreground">: </span>
                <span className="text-green-600 dark:text-green-400">
                  &quot;USD&quot;
                </span>
                {"\n"}
                <span className="text-foreground">{"}"}</span>
              </CodeBlock>
            </div>

            <div className="mt-6">
              <CodeBlock title="→ Unified">
                <span className="text-foreground">{"{"}</span>
                {"\n  "}
                <span className="text-blue-600 dark:text-blue-400">id</span>
                <span className="text-foreground">: </span>
                <span className="text-green-600 dark:text-green-400">
                  &quot;quickbooks:130&quot;
                </span>
                <span className="text-foreground"> | </span>
                <span className="text-green-600 dark:text-green-400">
                  &quot;xero:fee88eea-...&quot;
                </span>
                <span className="text-foreground">,</span>
                {"\n  "}
                <span className="text-blue-600 dark:text-blue-400">source</span>
                <span className="text-foreground">: </span>
                <span className="text-green-600 dark:text-green-400">
                  &quot;quickbooks&quot;
                </span>
                <span className="text-foreground"> | </span>
                <span className="text-green-600 dark:text-green-400">
                  &quot;xero&quot;
                </span>
                <span className="text-foreground">,</span>
                {"\n  "}
                <span className="text-blue-600 dark:text-blue-400">
                  invoice_number
                </span>
                <span className="text-foreground">: </span>
                <span className="text-green-600 dark:text-green-400">
                  &quot;1037&quot;
                </span>
                <span className="text-foreground"> | </span>
                <span className="text-green-600 dark:text-green-400">
                  &quot;INV-0027&quot;
                </span>
                <span className="text-foreground">,</span>
                {"\n  "}
                <span className="text-blue-600 dark:text-blue-400">status</span>
                <span className="text-foreground">: </span>
                <span className="text-green-600 dark:text-green-400">
                  &quot;open&quot;
                </span>
                <span className="text-foreground">,</span>
                {"\n  "}
                <span className="text-blue-600 dark:text-blue-400">
                  total_amount_cents
                </span>
                <span className="text-foreground">: </span>
                <span className="text-amber-600 dark:text-amber-400">36207</span>
                <span className="text-foreground">,</span>
                {"\n  "}
                <span className="text-blue-600 dark:text-blue-400">currency</span>
                <span className="text-foreground">: </span>
                <span className="text-green-600 dark:text-green-400">
                  &quot;USD&quot;
                </span>
                <span className="text-foreground">,</span>
                {"\n  "}
                <span className="text-blue-600 dark:text-blue-400">
                  issue_date
                </span>
                <span className="text-foreground">: </span>
                <span className="text-green-600 dark:text-green-400">
                  &quot;2026-05-02&quot;
                </span>
                <span className="text-foreground">,</span>
                {"\n  "}
                <span className="text-blue-600 dark:text-blue-400">vendor</span>
                <span className="text-foreground">: {"{ name, source_id }"}</span>
                <span className="text-foreground">,</span>
                {"\n  "}
                <span className="text-blue-600 dark:text-blue-400">
                  line_items
                </span>
                <span className="text-foreground">: [...]</span>
                {"\n"}
                <span className="text-foreground">{"}"}</span>
              </CodeBlock>
            </div>
          </div>
        </section>

        {/* Architecture */}
        <section className="py-20 md:py-32">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Architecture
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              A small provider pattern.
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              Each accounting system implements a single InvoiceProvider
              interface. Adding a third system means writing one new file.
            </p>
            <div className="mt-12">
              <ArchitectureDiagram />
            </div>
          </div>
        </section>

        <LearnedSection />
      </main>

      <LandingFooter />
    </div>
  );
}
