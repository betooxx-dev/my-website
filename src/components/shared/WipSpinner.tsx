import { getTranslations } from "next-intl/server";

interface WipSpinnerProps {
  tone?: "dark" | "light";
}

export default async function WipSpinner({ tone = "dark" }: WipSpinnerProps) {
  const t = await getTranslations("common");
  const isDark = tone === "dark";

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-24">
      {/* Spinner */}
      <div className="relative flex h-20 w-20 items-center justify-center">
        {/* Track */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 80 80"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="40"
            cy="40"
            r="34"
            stroke="currentColor"
            strokeWidth="2"
            className={isDark ? "text-pine-900/10" : "text-mint-50/10"}
          />
        </svg>
        {/* Arc */}
        <svg
          className="wip-spinner absolute inset-0 h-full w-full"
          viewBox="0 0 80 80"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="40"
            cy="40"
            r="34"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="60 154"
            className="text-amber-400"
          />
        </svg>
        {/* Center dot */}
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-400" />
        </span>
      </div>

      {/* Text */}
      <div className="text-center">
        <p
          className={`font-mono text-xs uppercase tracking-widest ${isDark ? "text-pine-900/35" : "text-mint-50/35"}`}
        >
          {t("wipLabel")}
        </p>
      </div>
    </div>
  );
}
