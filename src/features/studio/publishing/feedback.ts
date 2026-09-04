export function studioBlogSuccessUrl(recoveryKey: string): string {
  const search = new URLSearchParams({ saved: recoveryKey });
  return `/studio/blog?${search.toString()}`;
}

export function studioPostRecoveryKey(postId: string): string {
  return `post-${postId}`;
}
