import {
  studioClientEnvSchema,
  studioServerEnvSchema,
} from "@/lib/studio-env-policy";

const passwordHash =
  "scrypt:test-salt:0vdEp3zFMNJRLiyYzDoq560rnhIEArNIKn9ZdKuWGMyaHwHUqnxdnSRhbdZeG4UoztiSF2LU9KTlIK7TEhM2VQ";

describe("Studio environment policy", () => {
  it("keeps safe local defaults in development", () => {
    const server = studioServerEnvSchema(false).parse({
      NODE_ENV: "development",
    });
    const client = studioClientEnvSchema(false).parse({});

    expect(server.ARGOS_API_URL).toBe("http://localhost:5000/api");
    expect(server.STUDIO_USERNAME).toBe("studio");
    expect(client.NEXT_PUBLIC_SITE_URL).toBe("http://localhost:3000");
  });

  it("requires every Studio credential and API key in production", () => {
    expect(
      studioServerEnvSchema(true).safeParse({ NODE_ENV: "production" }).success,
    ).toBe(false);

    expect(
      studioServerEnvSchema(true).safeParse({
        ARGOS_API_URL: "https://api.example.com/api",
        NODE_ENV: "production",
        STUDIO_ARGOS_API_KEY: "replace-with-blog-admin-api-key",
        STUDIO_PASSWORD_HASH:
          "scrypt:replace-with-random-salt:replace-with-base64url-hash",
        STUDIO_SESSION_SECRET: "replace-with-at-least-32-random-characters",
        STUDIO_USERNAME: "studio",
      }).success,
    ).toBe(false);
  });

  it("rejects insecure production URLs and accepts explicit HTTPS config", () => {
    const insecureServer = studioServerEnvSchema(true).safeParse({
      ARGOS_API_URL: "http://api.example.com/api",
      NODE_ENV: "production",
      STUDIO_ARGOS_API_KEY: "blog-admin-api-key",
      STUDIO_PASSWORD_HASH: passwordHash,
      STUDIO_SESSION_SECRET: "a-production-session-secret-over-32-characters",
      STUDIO_USERNAME: "studio-owner",
    });
    const insecureClient = studioClientEnvSchema(true).safeParse({
      NEXT_PUBLIC_ARGOS_API_URL: "http://api.example.com/api",
      NEXT_PUBLIC_SITE_URL: "http://example.com",
    });

    expect(insecureServer.success).toBe(false);
    expect(insecureClient.success).toBe(false);

    expect(
      studioServerEnvSchema(true).safeParse({
        ARGOS_API_URL: "https://api.example.com/api",
        NODE_ENV: "production",
        STUDIO_ARGOS_API_KEY: "blog-admin-api-key",
        STUDIO_PASSWORD_HASH: passwordHash,
        STUDIO_SESSION_SECRET: "a-production-session-secret-over-32-characters",
        STUDIO_USERNAME: "studio-owner",
      }).success,
    ).toBe(true);
    expect(
      studioClientEnvSchema(true).safeParse({
        NEXT_PUBLIC_ARGOS_API_URL: "https://api.example.com/api",
        NEXT_PUBLIC_SITE_URL: "https://example.com",
      }).success,
    ).toBe(true);
  });
});
