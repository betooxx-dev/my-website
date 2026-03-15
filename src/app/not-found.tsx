import Link from "next/link";
import "@/styles/not-found.css";

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
    <html lang="en" className="nf-html">
      <body className="nf-body">
        {/* Radial amber atmosphere */}
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: 700,
              height: 700,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(212,165,116,0.05) 0%, transparent 65%)",
            }}
          />
        </div>

        {/* Ghost 404 — typographic watermark */}
        <div
          aria-hidden="true"
          className="nf-reveal"
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            userSelect: "none",
            animationDelay: "0s",
          }}
        >
          <span
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "30vw",
              fontWeight: 700,
              lineHeight: 1,
              color: "rgba(244,255,248,0.03)",
            }}
          >
            404
          </span>
        </div>

        {/* Content */}
        <main
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            textAlign: "center",
            padding: "0 24px",
          }}
        >
          {/* Label */}
          <p
            className="nf-reveal"
            style={{
              fontFamily: "'DM Mono', ui-monospace, monospace",
              fontSize: 11,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "#d4a574",
              marginBottom: 24,
              animationDelay: "0.3s",
            }}
          >
            {copy.label}
          </p>

          {/* Thin amber rule */}
          <div
            aria-hidden="true"
            className="nf-reveal"
            style={{
              height: 1,
              width: 32,
              background: "rgba(212,165,116,0.4)",
              marginBottom: 32,
              animationDelay: "0.42s",
            }}
          />

          {/* Heading */}
          <h1
            className="nf-reveal"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(28px, 5vw, 40px)",
              fontWeight: 700,
              color: "#f4fff8",
              letterSpacing: "-0.02em",
              marginBottom: 16,
              animationDelay: "0.5s",
            }}
          >
            {copy.heading}
          </h1>

          {/* Description */}
          <p
            className="nf-reveal"
            style={{
              fontSize: 14,
              lineHeight: 1.7,
              color: "rgba(244,255,248,0.5)",
              maxWidth: 340,
              marginBottom: 40,
              animationDelay: "0.6s",
            }}
          >
            {copy.body}
          </p>

          {/* CTA */}
          <div className="nf-reveal" style={{ animationDelay: "0.72s" }}>
            <Link href="/" className="nf-cta">
              {copy.cta}
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
