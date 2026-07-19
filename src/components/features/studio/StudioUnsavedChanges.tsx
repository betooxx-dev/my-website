"use client";

import { useEffect, useRef } from "react";

type StudioUnsavedChangesProps = {
  clearWhen?: boolean;
  message: string;
  storageKey: string;
};

type RecoveryValue = {
  checked?: boolean;
  value?: string;
};

type RecoverySnapshot = Record<string, RecoveryValue>;

const RECOVERY_PREFIX = "studio:form-recovery:";

export function StudioUnsavedChanges({
  clearWhen = false,
  message,
  storageKey,
}: StudioUnsavedChangesProps) {
  const markerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const form = markerRef.current?.closest("form");
    if (!form) return;

    const recoveryStorageKey = `${RECOVERY_PREFIX}${storageKey}`;
    if (clearWhen) {
      safelyRemoveRecovery(recoveryStorageKey);
    }

    let dirty = clearWhen ? false : restoreForm(form, recoveryStorageKey);
    const persistRecovery = () => {
      dirty = true;
      safelyStoreRecovery(recoveryStorageKey, snapshotForm(form));
    };
    const prepareForSubmit = () => {
      persistRecovery();
      dirty = false;
    };
    const clearRecovery = () => {
      dirty = false;
      safelyRemoveRecovery(recoveryStorageKey);
    };
    const warnBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = message;
    };

    form.addEventListener("input", persistRecovery);
    form.addEventListener("change", persistRecovery);
    form.addEventListener("reset", clearRecovery);
    form.addEventListener("submit", prepareForSubmit);
    window.addEventListener("beforeunload", warnBeforeUnload);

    return () => {
      form.removeEventListener("input", persistRecovery);
      form.removeEventListener("change", persistRecovery);
      form.removeEventListener("reset", clearRecovery);
      form.removeEventListener("submit", prepareForSubmit);
      window.removeEventListener("beforeunload", warnBeforeUnload);
    };
  }, [clearWhen, message, storageKey]);

  return (
    <span
      aria-hidden="true"
      data-studio-recovery={storageKey}
      hidden
      ref={markerRef}
    />
  );
}

function snapshotForm(form: HTMLFormElement): RecoverySnapshot {
  const snapshot: RecoverySnapshot = {};

  for (const control of Array.from(form.elements)) {
    if (!isRecoverableControl(control) || !control.id) continue;
    if (isIgnoredInput(control)) continue;

    if (
      control instanceof HTMLInputElement &&
      (control.type === "checkbox" || control.type === "radio")
    ) {
      snapshot[control.id] = { checked: control.checked };
    } else {
      snapshot[control.id] = { value: control.value };
    }
  }

  return snapshot;
}

function restoreForm(form: HTMLFormElement, storageKey: string) {
  const snapshot = safelyReadRecovery(storageKey);
  if (!snapshot) return false;

  for (const control of Array.from(form.elements)) {
    if (!isRecoverableControl(control) || !control.id) continue;
    const recovered = snapshot[control.id];
    if (!recovered) continue;

    if (
      control instanceof HTMLInputElement &&
      (control.type === "checkbox" || control.type === "radio")
    ) {
      control.checked = Boolean(recovered.checked);
    } else if (typeof recovered.value === "string") {
      control.value = recovered.value;
    }
  }

  return true;
}

function safelyReadRecovery(storageKey: string): RecoverySnapshot | null {
  try {
    const value = window.sessionStorage.getItem(storageKey);
    return value ? (JSON.parse(value) as RecoverySnapshot) : null;
  } catch {
    return null;
  }
}

function safelyStoreRecovery(storageKey: string, snapshot: RecoverySnapshot) {
  try {
    window.sessionStorage.setItem(storageKey, JSON.stringify(snapshot));
  } catch {
    // The beforeunload warning still protects the edit if storage is unavailable.
  }
}

function safelyRemoveRecovery(storageKey: string) {
  try {
    window.sessionStorage.removeItem(storageKey);
  } catch {
    // Storage can be unavailable in privacy-restricted browser contexts.
  }
}

function isRecoverableControl(
  control: Element,
): control is HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement {
  return (
    control instanceof HTMLInputElement ||
    control instanceof HTMLSelectElement ||
    control instanceof HTMLTextAreaElement
  );
}

function isIgnoredInput(
  control: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
) {
  return (
    control instanceof HTMLInputElement &&
    ["button", "file", "hidden", "reset", "submit"].includes(control.type)
  );
}
