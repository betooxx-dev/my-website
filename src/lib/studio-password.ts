import "server-only";
import { scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);
const PASSWORD_HASH_BYTES = 64;

export async function verifyStudioPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  const [scheme, salt, expectedHash] = storedHash.split(":");

  if (scheme !== "scrypt" || !salt || !expectedHash) {
    return false;
  }

  const expected = Buffer.from(expectedHash, "base64url");
  const actual = (await scryptAsync(
    password,
    salt,
    PASSWORD_HASH_BYTES,
  )) as Buffer;

  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
