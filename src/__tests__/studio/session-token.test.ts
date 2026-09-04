import {
  createStudioSessionToken,
  verifyStudioSessionToken,
} from "@/features/studio/auth/token";

describe("studio session token", () => {
  it("accepts issued tokens and rejects tampered tokens", async () => {
    const secret = "test-secret-with-enough-entropy";
    const expiresAt = Date.now() + 60_000;
    const token = await createStudioSessionToken(secret, "studio", expiresAt);

    await expect(verifyStudioSessionToken(token, secret)).resolves.toBe(true);
    await expect(
      verifyStudioSessionToken(`${token.slice(0, -1)}x`, secret),
    ).resolves.toBe(false);
  });

  it("rejects expired tokens", async () => {
    const secret = "test-secret-with-enough-entropy";
    const token = await createStudioSessionToken(
      secret,
      "studio",
      Date.now() - 1_000,
    );

    await expect(verifyStudioSessionToken(token, secret)).resolves.toBe(false);
  });
});
