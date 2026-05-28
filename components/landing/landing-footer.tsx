import Link from "next/link";

const GITHUB_URL = "https://github.com/Maurya30/Unified_invoice_api";
const LINKEDIN_URL =
  "https://www.linkedin.com/in/maurya-panchal-892b2424a/";

export function LandingFooter() {
  return (
    <footer className="mt-32 border-t border-border py-16">
      <div className="mx-auto max-w-6xl px-6 text-center md:px-8">
        <p className="text-sm text-muted-foreground">
          Built by Maurya Panchal · A learning project, not a product.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary transition-colors duration-200 hover:text-primary/80"
          >
            GitHub
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary transition-colors duration-200 hover:text-primary/80"
          >
            LinkedIn
          </a>
          <Link
            href="/dashboard"
            className="text-primary transition-colors duration-200 hover:text-primary/80"
          >
            Dashboard
          </Link>
        </div>
        <p className="mt-8 text-xs text-muted-foreground">
          © 2026 · No real customer data — sandbox only
        </p>
      </div>
    </footer>
  );
}
