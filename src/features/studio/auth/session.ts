import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { env } from "@/env";
import {
  getStudioSessionCookieOptions,
  STUDIO_SESSION_MAX_AGE_SECONDS,
} from "@/features/studio/auth/cookie";
import {
  createStudioSessionToken,
  STUDIO_SESSION_COOKIE,
  verifyStudioSessionToken,
} from "@/features/studio/auth/token";
import { studioAuthConfig } from "@/features/studio/env-policy";
import { isStudioEnabled } from "@/features/studio/public-policy";

export async function createStudioSessionCookie() {
  const auth = studioAuthConfig(env);
  const cookieStore = await cookies();
  const expiresAt = Date.now() + STUDIO_SESSION_MAX_AGE_SECONDS * 1000;
  const token = await createStudioSessionToken(
    auth.STUDIO_SESSION_SECRET,
    auth.STUDIO_USERNAME,
    expiresAt,
  );

  cookieStore.set(
    STUDIO_SESSION_COOKIE,
    token,
    getStudioSessionCookieOptions(STUDIO_SESSION_MAX_AGE_SECONDS),
  );
}

export async function clearStudioSessionCookie() {
  const cookieStore = await cookies();

  cookieStore.set(STUDIO_SESSION_COOKIE, "", getStudioSessionCookieOptions(0));
}

export async function hasStudioSession() {
  if (!isStudioEnabled(env.NODE_ENV)) return false;

  const auth = studioAuthConfig(env);
  const cookieStore = await cookies();
  const token = cookieStore.get(STUDIO_SESSION_COOKIE)?.value;

  return verifyStudioSessionToken(token, auth.STUDIO_SESSION_SECRET);
}

export async function requireStudioSession() {
  if (!isStudioEnabled(env.NODE_ENV)) notFound();

  if (!(await hasStudioSession())) {
    redirect("/studio/login");
  }
}
