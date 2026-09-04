import type { Instrumentation } from "next";

export const onRequestError: Instrumentation.onRequestError = (
  error,
  request,
  context,
) => {
  console.error("Unhandled server request error", {
    digest:
      typeof error === "object" && error !== null && "digest" in error
        ? error.digest
        : undefined,
    method: request.method,
    path: request.path,
    routePath: context.routePath,
    routeType: context.routeType,
  });
};
