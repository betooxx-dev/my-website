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
import { studioAuthConfig } from "@/features/studio/env-policy";
import { isStudioEnabled } from "@/features/studio/public-policy";

export async function POST(request: NextRequest) {
  if (!isStudioEnabled(env.NODE_ENV)) {
    return new Response(null, { status: 404 });
  }

  const auth = studioAuthConfig(env);
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");

  const isValidUsername =
    typeof username === "string" && username === auth.STUDIO_USERNAME;
  const isValidPassword =
    typeof password === "string" &&
    (await verifyStudioPassword(password, auth.STUDIO_PASSWORD_HASH));

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
    auth.STUDIO_SESSION_SECRET,
    auth.STUDIO_USERNAME,
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
