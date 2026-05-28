"use client";

import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";

const GITHUB_URL = "https://github.com/Maurya30/Unified_invoice_api";

export function LandingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-1.5 font-bold tracking-tight transition-colors duration-200 hover:text-primary"
        >
          unified
          <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
        </Link>
        <nav className="flex items-center gap-3 sm:gap-5">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            Dashboard
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground sm:inline"
          >
            GitHub
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
