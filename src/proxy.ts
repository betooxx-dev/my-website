import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { env } from "./env";
import { routing } from "./i18n/routing";
import {
  getStudioRouteDecision,
  STUDIO_SESSION_COOKIE,
  verifyStudioSessionToken,
} from "./lib/studio-auth";

const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/studio" || pathname.startsWith("/studio/")) {
    const token = request.cookies.get(STUDIO_SESSION_COOKIE)?.value;
    const hasSession = await verifyStudioSessionToken(
      token,
      env.STUDIO_SESSION_SECRET,
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
