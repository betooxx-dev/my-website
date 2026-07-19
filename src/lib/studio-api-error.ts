function messageFrom(value: unknown): string | undefined {
  if (typeof value === "string") {
    const message = value.trim();
    return message || undefined;
  }

  if (Array.isArray(value)) {
    const messages = value
      .map((item) => messageFrom(item))
      .filter((message): message is string => Boolean(message));
    return messages.length > 0 ? messages.join(" ") : undefined;
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return messageFrom(record.message) ?? messageFrom(record.error);
  }

  return undefined;
}

export function studioApiErrorMessage(
  payload: unknown,
  status: number,
): string {
  return (
    messageFrom(payload) ??
    `El backend del Studio rechazó la solicitud (${status}).`
  );
}
