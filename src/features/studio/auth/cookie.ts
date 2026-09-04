import { env } from "@/env";

export const STUDIO_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

export function getStudioSessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    maxAge,
    path: "/studio",
    sameSite: "lax" as const,
    secure: env.NODE_ENV === "production",
  };
}
