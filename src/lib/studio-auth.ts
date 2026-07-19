export const STUDIO_SESSION_COOKIE = "studio_session";
const SESSION_PREFIX = "v1";

export type StudioSessionPayload = {
  expiresAt: number;
  issuedAt: number;
  nonce: string;
  subject: string;
};

export type StudioRouteDecision =
  | { kind: "allow" }
  | { kind: "redirect"; destination: string };

export function getStudioRouteDecision(
  pathname: string,
  hasSession: boolean,
): StudioRouteDecision {
  if (pathname === "/studio/login") {
    if (hasSession) {
      return { kind: "redirect", destination: "/studio" };
    }

    return { kind: "allow" };
  }

  if (pathname === "/studio" || pathname.startsWith("/studio/")) {
    if (!hasSession) {
      return { kind: "redirect", destination: "/studio/login" };
    }
  }

  return { kind: "allow" };
}

export async function createStudioSessionToken(
  secret: string,
  subject: string,
  expiresAt: number,
): Promise<string> {
  const payload: StudioSessionPayload = {
    expiresAt,
    issuedAt: Date.now(),
    nonce: createNonce(),
    subject,
  };
  const encodedPayload = base64UrlEncode(
    new TextEncoder().encode(JSON.stringify(payload)),
  );
  const signature = await signSessionPayload(secret, encodedPayload);

  return [SESSION_PREFIX, encodedPayload, signature].join(".");
}

export async function verifyStudioSessionToken(
  token: string | undefined,
  secret: string,
): Promise<boolean> {
  return (await readStudioSessionToken(token, secret)) !== null;
}

export async function readStudioSessionToken(
  token: string | undefined,
  secret: string,
): Promise<StudioSessionPayload | null> {
  if (!token) return null;

  const [version, encodedPayload, signature] = token.split(".");
  if (version !== SESSION_PREFIX || !encodedPayload || !signature) {
    return null;
  }

  const expected = await signSessionPayload(secret, encodedPayload);
  if (!constantTimeEquals(expected, signature)) {
    return null;
  }

  const payload = parsePayload(encodedPayload);
  if (!payload || payload.expiresAt <= Date.now()) {
    return null;
  }

  return payload;
}

async function signSessionPayload(
  secret: string,
  encodedPayload: string,
): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { hash: "SHA-256", name: "HMAC" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(encodedPayload),
  );

  return base64UrlEncode(signature);
}

function parsePayload(encodedPayload: string): StudioSessionPayload | null {
  try {
    const decoded = new TextDecoder().decode(base64UrlDecode(encodedPayload));
    const payload = JSON.parse(decoded) as Partial<StudioSessionPayload>;

    if (
      typeof payload.subject !== "string" ||
      typeof payload.expiresAt !== "number" ||
      typeof payload.issuedAt !== "number" ||
      typeof payload.nonce !== "string" ||
      !Number.isSafeInteger(payload.expiresAt) ||
      !Number.isSafeInteger(payload.issuedAt)
    ) {
      return null;
    }

    return {
      expiresAt: payload.expiresAt,
      issuedAt: payload.issuedAt,
      nonce: payload.nonce,
      subject: payload.subject,
    };
  } catch {
    return null;
  }
}

function createNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return base64UrlEncode(bytes);
}

function constantTimeEquals(left: string, right: string): boolean {
  if (left.length !== right.length) return false;

  let difference = 0;
  for (let index = 0; index < left.length; index++) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return difference === 0;
}

function base64UrlEncode(value: ArrayBuffer | Uint8Array): string {
  const bytes = new Uint8Array(value);
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function base64UrlDecode(value: string): Uint8Array {
  const base64 = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "=",
  );
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index++) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}
