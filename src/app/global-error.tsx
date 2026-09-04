"use client";

import { useEffect } from "react";
import { globalErrorCopy } from "@/config/global-error-copy";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="es">
      <body className="bg-pine-900 text-mint-50">
        <main className="flex min-h-screen items-center justify-center px-6 text-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-amber-400">
              {globalErrorCopy.eyebrow}
            </p>
            <h1 className="mt-5 font-heading text-3xl font-bold">
              {globalErrorCopy.heading}
            </h1>
            <p className="mt-3 text-sm text-mint-50/60">
              {globalErrorCopy.description}
            </p>
            <button
              className="mt-8 rounded-full border border-amber-400/50 px-5 py-2 text-sm text-amber-300 transition-colors hover:bg-amber-400/10 focus:outline-none focus:ring-2 focus:ring-amber-300/50"
              onClick={reset}
              type="button"
            >
              {globalErrorCopy.retry}
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
