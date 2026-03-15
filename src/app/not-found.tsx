import Link from "next/link";

// Root-level fallback — no next-intl context available here.
// Strings are intentionally hardcoded (English fallback for invalid locales).
const copy = {
  label: "404",
  heading: "Page not found",
  body: "The page you\u2019re looking for doesn\u2019t exist or has been moved.",
  cta: "\u2190 Back to home",
};

export default function RootNotFound() {
  return (
    <html lang="en" className="bg-pine-900">
      <body className="m-0 bg-pine-900 font-sans text-mint-50 antialiased">
        {/* Radial amber atmosphere */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 flex items-center justify-center"
        >
          <div
            className="h-[700px] w-[700px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(212,165,116,0.05) 0%, transparent 65%)",
            }}
          />
        </div>

        {/* Ghost 404 — typographic watermark */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 flex select-none items-center justify-center"
        >
          <span className="font-serif text-[30vw] font-bold leading-none text-mint-50/[0.03]">
            404
          </span>
        </div>

        {/* Content */}
        <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
          {/* Label */}
          <p className="mb-6 font-mono text-[11px] tracking-[0.35em] uppercase text-amber-400">
            {copy.label}
          </p>

          {/* Thin amber rule */}
          <div aria-hidden="true" className="mb-8 h-px w-8 bg-amber-400/40" />

          {/* Heading */}
          <h1 className="mb-4 font-serif text-4xl font-bold tracking-tight text-mint-50">
            {copy.heading}
          </h1>

          {/* Description */}
          <p className="mb-10 max-w-[22rem] text-sm leading-relaxed text-mint-50/50">
            {copy.body}
          </p>

          {/* CTA */}
          <Link
            href="/"
            className="group relative font-mono text-[11px] tracking-[0.2em] uppercase text-amber-400 transition-colors duration-300 hover:text-amber-300"
          >
            {copy.cta}
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-amber-400 transition-all duration-500 group-hover:w-full" />
          </Link>
        </main>
      </body>
    </html>
  );
}
