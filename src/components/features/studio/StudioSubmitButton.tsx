"use client";

import { useFormStatus } from "react-dom";
import {
  isStudioSubmitIntentPending,
  STUDIO_SUBMIT_INTENT_FIELD,
} from "@/features/studio/publishing/submit-state";
import { StudioIcon, type StudioIconName } from "./StudioIcon";
import {
  studioPrimaryButtonClass,
  studioSecondaryButtonClass,
} from "./StudioUi";

type StudioSubmitButtonProps = {
  children: React.ReactNode;
  className?: string;
  confirmation?: string;
  icon?: StudioIconName;
  intent?: string;
  pendingLabel: string;
  variant?: "danger" | "primary" | "secondary";
};

export function StudioSubmitButton({
  children,
  className = "",
  confirmation,
  icon,
  intent,
  pendingLabel,
  variant = "primary",
}: StudioSubmitButtonProps) {
  const { data, pending } = useFormStatus();
  const isCurrentSubmission = isStudioSubmitIntentPending(
    pending,
    data?.get(STUDIO_SUBMIT_INTENT_FIELD) ?? null,
    intent,
  );
  const variantClass =
    variant === "primary"
      ? studioPrimaryButtonClass
      : variant === "danger"
        ? "inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full border border-destructive/25 bg-destructive/8 px-5 text-sm font-semibold text-destructive transition-colors hover:border-destructive/45 hover:bg-destructive/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive disabled:cursor-wait disabled:opacity-60 motion-reduce:transition-none"
        : studioSecondaryButtonClass;

  return (
    <button
      aria-disabled={pending}
      className={`${variantClass} disabled:cursor-wait disabled:opacity-60 ${className}`}
      disabled={pending}
      name={intent ? STUDIO_SUBMIT_INTENT_FIELD : undefined}
      onClick={(event) => {
        if (confirmation && !window.confirm(confirmation)) {
          event.preventDefault();
        }
      }}
      type="submit"
      value={intent}
    >
      {isCurrentSubmission ? (
        <svg
          aria-hidden="true"
          className="size-4 animate-spin motion-reduce:animate-none"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="opacity-80"
            d="M21 12a9 9 0 0 0-9-9"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="3"
          />
        </svg>
      ) : null}
      {!isCurrentSubmission && icon ? (
        <StudioIcon className="size-4" name={icon} />
      ) : null}
      <span aria-live="polite">
        {isCurrentSubmission ? pendingLabel : children}
      </span>
    </button>
  );
}
