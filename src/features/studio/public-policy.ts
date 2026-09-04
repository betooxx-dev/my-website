export function isStudioEnabled(nodeEnv: string | undefined): boolean {
  return nodeEnv !== "production";
}
