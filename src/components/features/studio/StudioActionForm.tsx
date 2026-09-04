"use client";

import { useActionState } from "react";
import {
  initialStudioActionState,
  type StudioFormAction,
} from "@/features/studio/publishing/action-state";

type StudioActionFormProps = {
  action: StudioFormAction;
  children: React.ReactNode;
  className?: string;
};

export function StudioActionForm({
  action,
  children,
  className,
}: StudioActionFormProps) {
  const [state, formAction] = useActionState(action, initialStudioActionState);

  return (
    <form action={formAction} className={className}>
      {state.error ? (
        <p
          aria-live="assertive"
          className="mb-5 rounded-2xl border border-destructive/25 bg-destructive/8 px-4 py-3 text-sm leading-6 text-destructive"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}
      {children}
    </form>
  );
}
