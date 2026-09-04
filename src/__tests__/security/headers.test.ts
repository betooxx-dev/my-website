import { securityHeaders } from "@/config/security-headers";

describe("security headers", () => {
  it("applies browser protections to every environment", () => {
    expect(securityHeaders("development")).toEqual(
      expect.arrayContaining([
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      ]),
    );
  });

  it("only enables HSTS for production", () => {
    expect(securityHeaders("development")).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: "Strict-Transport-Security" }),
      ]),
    );
    expect(securityHeaders("production")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: "Strict-Transport-Security" }),
      ]),
    );
  });
});
