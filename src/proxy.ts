import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { env } from "./env";
import { getPublicBlogRedirect } from "./features/blog/public-policy";
import {
  getStudioRouteDecision,
  STUDIO_SESSION_COOKIE,
  verifyStudioSessionToken,
} from "./features/studio/auth/token";
import { studioAuthConfig } from "./features/studio/env-policy";
import { isStudioEnabled } from "./features/studio/public-policy";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const publicBlogRedirect = getPublicBlogRedirect(pathname, env.NODE_ENV);

  if (publicBlogRedirect) {
    return NextResponse.redirect(new URL(publicBlogRedirect, request.url));
  }

  if (pathname === "/studio" || pathname.startsWith("/studio/")) {
    if (!isStudioEnabled(env.NODE_ENV)) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const auth = studioAuthConfig(env);
    const token = request.cookies.get(STUDIO_SESSION_COOKIE)?.value;
    const hasSession = await verifyStudioSessionToken(
      token,
      auth.STUDIO_SESSION_SECRET,
    );
    const decision = getStudioRouteDecision(pathname, hasSession);

    if (decision.kind === "redirect") {
      return NextResponse.redirect(new URL(decision.destination, request.url));
    }

    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(es|en)/:path*", "/studio/:path*"],
};
