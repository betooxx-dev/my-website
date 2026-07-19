const localAssetHosts = new Set(["127.0.0.1", "::1", "localhost"]);

export function shouldBypassImageOptimization(value: string) {
  try {
    return localAssetHosts.has(new URL(value).hostname.toLowerCase());
  } catch {
    return false;
  }
}
