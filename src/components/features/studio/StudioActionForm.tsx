"use client";

import { useActionState, useRef } from "react";
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
  const failedRef = useRef(false);
  const preserveFailedInput: StudioFormAction = async (previous, formData) => {
    const result = await action(previous, formData);
    failedRef.current = Boolean(result.error);
    return result;
  };
  const [state, formAction] = useActionState(
    preserveFailedInput,
    initialStudioActionState,
  );

  return (
    <form
      action={formAction}
      className={className}
      onResetCapture={(event) => {
        // React resets uncontrolled inputs after a resolved action, including
        // recoverable errors. Keep the editor intact when the operation failed.
        if (failedRef.current) event.preventDefault();
      }}
    >
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
