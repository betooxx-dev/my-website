const LOCAL_SITE_URL = "http://localhost:3000";
const PROVISIONAL_PRODUCTION_SITE_URL = "https://alberto-avendano.vercel.app";

interface SiteUrlEnvironment {
  configuredUrl?: string;
  nodeEnv?: string;
  vercelProductionUrl?: string;
}

function withoutTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

export function resolveSiteUrl({
  configuredUrl,
  nodeEnv,
  vercelProductionUrl,
}: SiteUrlEnvironment): string {
  if (configuredUrl) return withoutTrailingSlash(configuredUrl);

  if (vercelProductionUrl) {
    return withoutTrailingSlash(`https://${vercelProductionUrl}`);
  }

  return nodeEnv === "production"
    ? PROVISIONAL_PRODUCTION_SITE_URL
    : LOCAL_SITE_URL;
}
