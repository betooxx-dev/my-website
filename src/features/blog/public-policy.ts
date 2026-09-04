const PUBLIC_BLOG_PATH = /^\/(es|en)\/blog(?:\/|$)/;

export function isPublicBlogEnabled(nodeEnv: string | undefined): boolean {
  return nodeEnv !== "production";
}

export function getPublicBlogRedirect(
  pathname: string,
  nodeEnv: string | undefined,
): string | null {
  if (isPublicBlogEnabled(nodeEnv)) return null;

  const match = pathname.match(PUBLIC_BLOG_PATH);
  const locale = match?.[1];
  return locale ? `/${locale}` : null;
}
