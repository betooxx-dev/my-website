import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { securityHeaders } from "./src/config/security-headers";

const withNextIntl = createNextIntlPlugin();
const argosPublicUrl = new URL(
  process.env.NEXT_PUBLIC_ARGOS_API_URL ?? "http://localhost:5000/api",
);
const argosAssetPath = `${argosPublicUrl.pathname.replace(/\/$/, "")}/blog/assets/**`;

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingIncludes: {
    "/*": ["./content/blog/**/*"],
  },
  allowedDevOrigins: ["127.0.0.1"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders(process.env.NODE_ENV),
      },
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "9mb",
    },
  },
  images: {
    qualities: [75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "opengraph.github.com",
      },
      {
        protocol: "https",
        hostname: "images.credly.com",
        pathname: "/images/**",
      },
      {
        protocol: argosPublicUrl.protocol === "http:" ? "http" : "https",
        hostname: argosPublicUrl.hostname,
        port: argosPublicUrl.port,
        pathname: argosAssetPath,
      },
    ],
  },
};

export default withNextIntl(nextConfig);
