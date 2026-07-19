export const STUDIO_SUBMIT_INTENT_FIELD = "studioIntent";

export function isStudioSubmitIntentPending(
  pending: boolean,
  submittedIntent: FormDataEntryValue | null,
  buttonIntent?: string,
) {
  if (!pending) return false;
  if (!buttonIntent) return true;
  return submittedIntent === buttonIntent;
}
