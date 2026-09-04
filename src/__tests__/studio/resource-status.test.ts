import { getBlogContractStatus } from "@/features/studio/publishing/resource-status";

describe("Studio resource status", () => {
  it("never reports Argos as connected when the blog resource is unavailable", () => {
    expect(getBlogContractStatus("available")).toEqual({
      label: "Blog conectado",
      tone: "available",
    });
    expect(getBlogContractStatus("unauthorized")).toEqual({
      label: "Clave de API del Studio rechazada",
      tone: "warning",
    });
    expect(getBlogContractStatus("unavailable")).toEqual({
      label: "Argos no está disponible",
      tone: "warning",
    });
  });
});
