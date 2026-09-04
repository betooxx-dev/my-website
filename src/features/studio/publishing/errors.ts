import axios from "axios";

const MAX_MESSAGE_LENGTH = 240;

export function studioMutationErrorMessage(
  error: unknown,
  fallback = "No se pudo completar la operación.",
): string {
  const remoteMessage = axios.isAxiosError(error)
    ? readArgosMessage(error.response?.data)
    : undefined;
  const message =
    remoteMessage ?? (error instanceof Error ? error.message : fallback);
  return normalizeMessage(message, fallback);
}

export function studioPartialPublishMessage(cause: string): string {
  return normalizeMessage(
    `Los cambios se guardaron, pero no se pudo publicar. ${cause}`,
    "Los cambios se guardaron, pero no se pudo publicar.",
  );
}

function readArgosMessage(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object" || !("error" in payload)) {
    return undefined;
  }

  const responseError = payload.error;
  if (typeof responseError === "string") return responseError;
  if (!responseError || typeof responseError !== "object") return undefined;
  if (!("message" in responseError)) return undefined;

  const message = responseError.message;
  if (typeof message === "string") return message;
  if (Array.isArray(message)) {
    return message.filter((item) => typeof item === "string").join(" ");
  }

  return undefined;
}

function normalizeMessage(message: string, fallback: string): string {
  const normalized = message.replaceAll(/\s+/g, " ").trim();
  return normalized ? normalized.slice(0, MAX_MESSAGE_LENGTH) : fallback;
}
