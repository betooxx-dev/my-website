import { verifyStudioPassword } from "@/features/studio/auth/password";

describe("studio password auth", () => {
  it("accepts the configured scrypt password and rejects a wrong password", async () => {
    const hash =
      "scrypt:test-salt:GGp03_CxrK_udF3Hk_SoGBXB7i1a9TccbmpPi9Fp5ZEUZUbLNqHf7fZLCibf642XtkU6D9zcRsiAWpMN-6_4qA";

    await expect(verifyStudioPassword("correct-password", hash)).resolves.toBe(
      true,
    );
    await expect(verifyStudioPassword("wrong-password", hash)).resolves.toBe(
      false,
    );
  });
});
