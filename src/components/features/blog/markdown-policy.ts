export function safeMarkdownUrl(url: string, key: string): string {
  if (url.startsWith("//")) return "";
  if (/^https?:/i.test(url)) return url;
  if (key === "href") {
    if (/^(mailto|tel):/i.test(url)) return url;
    if (/^(#|\/|\.\/|\.\.\/)/.test(url)) return url;
  }
  if (key === "src" && url.startsWith("/")) return url;

  return "";
}
