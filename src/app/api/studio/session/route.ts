import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/env";
import {
  getStudioSessionCookieOptions,
  STUDIO_SESSION_MAX_AGE_SECONDS,
} from "@/features/studio/auth/cookie";
import { verifyStudioPassword } from "@/features/studio/auth/password";
import { studioRedirectUrl } from "@/features/studio/auth/redirect";
import {
  createStudioSessionToken,
  STUDIO_SESSION_COOKIE,
} from "@/features/studio/auth/token";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");

  const isValidUsername =
    typeof username === "string" && username === env.STUDIO_USERNAME;
  const isValidPassword =
    typeof password === "string" &&
    (await verifyStudioPassword(password, env.STUDIO_PASSWORD_HASH));

  if (!(isValidUsername && isValidPassword)) {
    return NextResponse.redirect(
      studioRedirectUrl(
        "/studio/login?error=invalid",
        env.NEXT_PUBLIC_SITE_URL,
      ),
      { status: 303 },
    );
  }

  const expiresAt = Date.now() + STUDIO_SESSION_MAX_AGE_SECONDS * 1000;
  const token = await createStudioSessionToken(
    env.STUDIO_SESSION_SECRET,
    env.STUDIO_USERNAME,
    expiresAt,
  );
  const response = NextResponse.redirect(
    studioRedirectUrl("/studio", env.NEXT_PUBLIC_SITE_URL),
    { status: 303 },
  );

  response.cookies.set(
    STUDIO_SESSION_COOKIE,
    token,
    getStudioSessionCookieOptions(STUDIO_SESSION_MAX_AGE_SECONDS),
  );

  return response;
}
