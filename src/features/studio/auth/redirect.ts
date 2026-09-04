export type StudioRedirectPath =
  | "/studio"
  | "/studio/login"
  | "/studio/login?error=invalid";

export function studioRedirectUrl(
  path: StudioRedirectPath,
  publicSiteUrl: string,
) {
  return new URL(path, publicSiteUrl);
}
