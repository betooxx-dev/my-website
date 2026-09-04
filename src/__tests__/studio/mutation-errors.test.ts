import {
  studioMutationErrorMessage,
  studioPartialPublishMessage,
} from "@/features/studio/publishing/errors";

describe("Studio mutation errors", () => {
  it("reads the structured Argos error message", () => {
    expect(
      studioMutationErrorMessage({
        isAxiosError: true,
        response: {
          data: {
            error: {
              message: "A post needs a cover before publishing",
            },
          },
        },
      }),
    ).toBe("A post needs a cover before publishing");
  });

  it("normalizes and bounds messages before rendering them", () => {
    expect(
      studioMutationErrorMessage(new Error(`Error\n${"x".repeat(300)}`)),
    ).toHaveLength(240);
  });

  it("uses a safe fallback for unknown failures", () => {
    expect(studioMutationErrorMessage(null, "No se pudo publicar.")).toBe(
      "No se pudo publicar.",
    );
  });

  it("makes a partial publish explicit", () => {
    expect(studioPartialPublishMessage("Argos no está disponible.")).toBe(
      "Los cambios se guardaron, pero no se pudo publicar. Argos no está disponible.",
    );
  });
});
