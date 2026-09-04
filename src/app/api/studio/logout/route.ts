import { NextResponse } from "next/server";
import { env } from "@/env";
import { getStudioSessionCookieOptions } from "@/features/studio/auth/cookie";
import { studioRedirectUrl } from "@/features/studio/auth/redirect";
import { STUDIO_SESSION_COOKIE } from "@/features/studio/auth/token";

export async function POST() {
  const response = NextResponse.redirect(
    studioRedirectUrl("/studio/login", env.NEXT_PUBLIC_SITE_URL),
    {
      status: 303,
    },
  );

  response.cookies.set(
    STUDIO_SESSION_COOKIE,
    "",
    getStudioSessionCookieOptions(0),
  );

  return response;
}
