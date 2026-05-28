interface CodeBlockProps {
  title: string;
  children: React.ReactNode;
}

export function CodeBlock({ title, children }: CodeBlockProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <p className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {title}
        </p>
      </div>
      <pre className="overflow-x-auto bg-muted p-4 font-mono text-sm leading-relaxed">
        <code>{children}</code>
      </pre>
    </div>
  );
}
