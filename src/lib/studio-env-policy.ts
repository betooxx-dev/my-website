import { z } from "zod";

const localPasswordHash =
  "scrypt:local-studio-salt:0vdEp3zFMNJRLiyYzDoq560rnhIEArNIKn9ZdKuWGMyaHwHUqnxdnSRhbdZeG4UoztiSF2LU9KTlIK7TEhM2VQ";
const passwordHash = z.string().regex(/^scrypt:[^:]+:[A-Za-z0-9_-]+$/);
const configuredPasswordHash = passwordHash.refine(
  (value) => !value.toLowerCase().includes("replace-with"),
  { message: "Replace the example Studio password hash." },
);
const httpsUrl = z
  .url()
  .refine((value) => new URL(value).protocol === "https:", {
    message: "Production URLs must use HTTPS.",
  });

function productionSecret(minimumLength: number) {
  return z
    .string()
    .min(minimumLength)
    .refine((value) => !value.toLowerCase().includes("replace-with"), {
      message: "Replace the example value with a real secret.",
    });
}

export function studioServerEnvSchema(production: boolean) {
  return z.object({
    ARGOS_API_URL: production
      ? httpsUrl
      : z.url().default("http://localhost:5000/api"),
    NODE_ENV: production
      ? z.literal("production")
      : z.enum(["development", "test"]).default("development"),
    STUDIO_ARGOS_API_KEY: production
      ? productionSecret(16)
      : z.string().min(16).optional(),
    STUDIO_USERNAME: production
      ? z.string().min(3)
      : z.string().min(3).default("studio"),
    STUDIO_PASSWORD_HASH: production
      ? configuredPasswordHash
      : passwordHash.default(localPasswordHash),
    STUDIO_SESSION_SECRET: production
      ? productionSecret(32)
      : z.string().min(24).default("local-studio-session-secret"),
  });
}

export function studioClientEnvSchema(production: boolean) {
  return z.object({
    NEXT_PUBLIC_SITE_URL: production
      ? httpsUrl
      : z.url().default("http://localhost:3000"),
    NEXT_PUBLIC_ARGOS_API_URL: production
      ? httpsUrl
      : z.url().default("http://localhost:5000/api"),
  });
}
