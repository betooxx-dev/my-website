import { NextResponse } from "next/server";
import { env } from "@/env";
import { STUDIO_SESSION_COOKIE } from "@/lib/studio-auth";
import { getStudioSessionCookieOptions } from "@/lib/studio-cookie";
import { studioRedirectUrl } from "@/lib/studio-redirect";

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
