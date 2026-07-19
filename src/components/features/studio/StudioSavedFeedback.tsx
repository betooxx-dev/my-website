"use client";

import { useEffect } from "react";

export function StudioSavedFeedback({ message }: { message: string }) {
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete("saved");
    window.history.replaceState(
      window.history.state,
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );
  }, []);

  return (
    <output
      aria-live="polite"
      className="mt-6 flex items-start gap-3 rounded-2xl border border-primary/25 bg-primary/8 px-4 py-3 text-sm leading-6 text-foreground"
    >
      <span
        aria-hidden="true"
        className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
      />
      {message}
    </output>
  );
}
