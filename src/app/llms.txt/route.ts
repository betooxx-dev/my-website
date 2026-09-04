import { env } from "@/env";
import { createLlmsTxt } from "@/features/seo/llms-txt";

export const dynamic = "force-static";

export function GET() {
  return new Response(createLlmsTxt(env.NEXT_PUBLIC_SITE_URL), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
