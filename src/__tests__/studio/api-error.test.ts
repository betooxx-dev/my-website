import { studioApiErrorMessage } from "@/lib/studio-api-error";

describe("Studio API error envelopes", () => {
  it("extracts Nest validation and conflict messages from the Argos envelope", () => {
    expect(
      studioApiErrorMessage(
        {
          error: {
            message: ["cover is required", "Markdown is required"],
            statusCode: 409,
          },
          success: false,
        },
        409,
      ),
    ).toBe("cover is required Markdown is required");

    expect(
      studioApiErrorMessage(
        { error: "request entity too large", success: false },
        413,
      ),
    ).toBe("request entity too large");
  });

  it("keeps a status fallback for non-JSON proxy responses", () => {
    expect(studioApiErrorMessage({}, 503)).toBe(
      "El backend del Studio rechazó la solicitud (503).",
    );
  });
});
