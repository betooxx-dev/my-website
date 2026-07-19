import { getStudioRouteDecision } from "@/lib/studio-auth";
import { studioRedirectUrl } from "@/lib/studio-redirect";

describe("studio auth routing", () => {
  it("redirects anonymous studio visitors to login", () => {
    expect(getStudioRouteDecision("/studio", false)).toEqual({
      kind: "redirect",
      destination: "/studio/login",
    });
  });

  it("redirects authenticated visitors away from login", () => {
    expect(getStudioRouteDecision("/studio/login", true)).toEqual({
      kind: "redirect",
      destination: "/studio",
    });
  });

  it("uses the configured public origin instead of an internal Docker host", () => {
    expect(
      studioRedirectUrl("/studio", "http://localhost:3000").toString(),
    ).toBe("http://localhost:3000/studio");
    expect(
      studioRedirectUrl(
        "/studio/login?error=invalid",
        "https://alberto.example",
      ).toString(),
    ).toBe("https://alberto.example/studio/login?error=invalid");
  });
});
