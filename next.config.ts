import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();
const argosPublicUrl = new URL(
  process.env.NEXT_PUBLIC_ARGOS_API_URL ?? "http://localhost:5000/api",
);
const argosAssetPath = `${argosPublicUrl.pathname.replace(/\/$/, "")}/blog/assets/**`;

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: "9mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "opengraph.github.com",
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
