export type StudioResourceStatus = "available" | "unauthorized" | "unavailable";

type BlogContractStatus = {
  label: string;
  tone: "available" | "warning";
};

export function getBlogContractStatus(
  status: StudioResourceStatus,
): BlogContractStatus {
  if (status === "available") {
    return { label: "Blog conectado", tone: "available" };
  }

  if (status === "unauthorized") {
    return { label: "Clave de API del Studio rechazada", tone: "warning" };
  }

  return { label: "Argos no está disponible", tone: "warning" };
}
