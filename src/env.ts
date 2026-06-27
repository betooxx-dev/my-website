import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    ARGOS_API_URL: z.url().default("http://localhost:5000/api"),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
    NEXT_PUBLIC_ARGOS_API_URL: z.url().default("http://localhost:5000/api"),
  },
  runtimeEnv: {
    ARGOS_API_URL: process.env.ARGOS_API_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_ARGOS_API_URL: process.env.NEXT_PUBLIC_ARGOS_API_URL,
  },
});
