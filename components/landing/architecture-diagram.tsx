export function ArchitectureDiagram() {
  return (
    <div className="w-full text-foreground">
      <svg
        viewBox="0 0 800 520"
        width="100%"
        height="auto"
        role="img"
        aria-label="Architecture diagram showing Dashboard, Unified Invoice API, and two providers"
        className="mx-auto max-w-3xl"
      >
        {/* Dashboard */}
        <rect
          x="300"
          y="20"
          width="200"
          height="48"
          rx="10"
          fill="hsl(var(--card))"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-border"
        />
        <text
          x="400"
          y="50"
          textAnchor="middle"
          className="fill-current text-sm font-semibold"
          fontSize="14"
        >
          Dashboard
        </text>

        {/* Arrow down */}
        <line x1="400" y1="68" x2="400" y2="95" stroke="currentColor" strokeWidth="1.5" />
        <polygon points="400,95 394,85 406,85" fill="currentColor" />
        <text x="410" y="88" fontSize="10" className="fill-muted-foreground font-mono">
          GET /api/invoices
        </text>

        {/* Unified API box */}
        <rect
          x="180"
          y="100"
          width="440"
          height="110"
          rx="12"
          fill="hsl(var(--primary) / 0.08)"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
        />
        <text x="400" y="128" textAnchor="middle" fontSize="15" fontWeight="600" fill="currentColor">
          Unified Invoice API
        </text>
        <text x="400" y="152" textAnchor="middle" fontSize="11" fill="currentColor" opacity="0.8">
          • Token refresh
        </text>
        <text x="400" y="170" textAnchor="middle" fontSize="11" fill="currentColor" opacity="0.8">
          • Promise.allSettled parallel fetch
        </text>
        <text x="400" y="188" textAnchor="middle" fontSize="11" fill="currentColor" opacity="0.8">
          • Zod validation
        </text>

        {/* Branch lines */}
        <line x1="280" y1="210" x2="200" y2="260" stroke="currentColor" strokeWidth="1.5" />
        <line x1="520" y1="210" x2="600" y2="260" stroke="currentColor" strokeWidth="1.5" />
        <polygon points="200,260 208,252 208,268" fill="currentColor" />
        <polygon points="600,260 592,252 592,268" fill="currentColor" />

        {/* QuickBooks Provider */}
        <rect
          x="60"
          y="265"
          width="280"
          height="120"
          rx="10"
          fill="hsl(var(--card))"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <text x="200" y="292" textAnchor="middle" fontSize="14" fontWeight="600" fill="currentColor">
          QuickBooks Provider
        </text>
        <text x="200" y="314" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.75">
          • OAuth 2.0 refresh
        </text>
        <text x="200" y="332" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.75">
          • SQL-style query
        </text>
        <text x="200" y="350" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.75">
          • Status derived from Balance
        </text>

        {/* Xero Provider */}
        <rect
          x="460"
          y="265"
          width="280"
          height="120"
          rx="10"
          fill="hsl(var(--card))"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <text x="600" y="292" textAnchor="middle" fontSize="14" fontWeight="600" fill="currentColor">
          Xero Provider
        </text>
        <text x="600" y="314" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.75">
          • Refresh token rotation
        </text>
        <text x="600" y="332" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.75">
          • MS JSON date format
        </text>
        <text x="600" y="350" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.75">
          • Xero-tenant-id header
        </text>

        {/* External APIs */}
        <line x1="200" y1="385" x2="200" y2="410" stroke="currentColor" strokeWidth="1.5" />
        <line x1="600" y1="385" x2="600" y2="410" stroke="currentColor" strokeWidth="1.5" />
        <polygon points="200,410 194,400 206,400" fill="currentColor" />
        <polygon points="600,410 594,400 606,400" fill="currentColor" />

        <rect
          x="80"
          y="415"
          width="240"
          height="44"
          rx="8"
          fill="hsl(var(--muted))"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.9"
        />
        <text x="200" y="443" textAnchor="middle" fontSize="12" fill="currentColor" opacity="0.7">
          QuickBooks Sandbox
        </text>

        <rect
          x="480"
          y="415"
          width="240"
          height="44"
          rx="8"
          fill="hsl(var(--muted))"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.9"
        />
        <text x="600" y="443" textAnchor="middle" fontSize="12" fill="currentColor" opacity="0.7">
          Xero Demo Company
        </text>
      </svg>
    </div>
  );
}
