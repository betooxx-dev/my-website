import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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

export async function createStudioSessionCookie() {
  const cookieStore = await cookies();
  const expiresAt = Date.now() + STUDIO_SESSION_MAX_AGE_SECONDS * 1000;
  const token = await createStudioSessionToken(
    env.STUDIO_SESSION_SECRET,
    env.STUDIO_USERNAME,
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
  const cookieStore = await cookies();
  const token = cookieStore.get(STUDIO_SESSION_COOKIE)?.value;

  return verifyStudioSessionToken(token, env.STUDIO_SESSION_SECRET);
}

export async function requireStudioSession() {
  if (!(await hasStudioSession())) {
    redirect("/studio/login");
  }
}
