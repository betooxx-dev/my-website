import ReactMarkdown, { type Components } from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { MarkdownImage } from "./MarkdownImage";
import { safeMarkdownUrl } from "./markdown-policy";

const components: Components = {
  a: ({ children, href }) => {
    const external = typeof href === "string" && /^https?:/i.test(href);

    return (
      <a
        className="font-medium text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary"
        href={href}
        rel={external ? "noopener noreferrer" : undefined}
        target={external ? "_blank" : undefined}
      >
        {children}
      </a>
    );
  },
  blockquote: ({ children }) => (
    <blockquote className="border-primary border-l-4 pl-5 text-muted-foreground italic">
      {children}
    </blockquote>
  ),
  code: ({ children, className }) => (
    <code
      className={
        className ??
        "rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground"
      }
    >
      {children}
    </code>
  ),
  h1: ({ children }) => (
    <h1 className="font-heading text-4xl leading-tight tracking-tight">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="font-heading text-3xl leading-tight tracking-tight">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-heading text-2xl leading-tight tracking-tight">
      {children}
    </h3>
  ),
  img: ({ alt, src }) => {
    if (typeof src !== "string" || !src) return null;

    return <MarkdownImage alt={alt ?? ""} src={src} />;
  },
  ol: ({ children }) => (
    <ol className="list-decimal space-y-2 pl-6 marker:text-primary">
      {children}
    </ol>
  ),
  p: ({ children }) => <p>{children}</p>,
  pre: ({ children }) => (
    <pre className="overflow-x-auto rounded-[1.25rem] border border-border bg-muted p-5 font-mono text-sm">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full border-collapse text-left text-sm">
        {children}
      </table>
    </div>
  ),
  td: ({ children }) => (
    <td className="border-border border-t px-4 py-3">{children}</td>
  ),
  th: ({ children }) => (
    <th className="bg-muted px-4 py-3 font-medium">{children}</th>
  ),
  ul: ({ children }) => (
    <ul className="list-disc space-y-2 pl-6 marker:text-primary">{children}</ul>
  ),
};

export function MarkdownContent({ source }: { source: string }) {
  return (
    <div className="flex flex-col gap-7 text-pretty text-[1.075rem] leading-8 text-foreground/90 [&>p:first-of-type]:first-letter:float-left [&>p:first-of-type]:first-letter:mr-2 [&>p:first-of-type]:first-letter:font-heading [&>p:first-of-type]:first-letter:text-6xl [&>p:first-of-type]:first-letter:font-semibold [&>p:first-of-type]:first-letter:leading-[0.82] sm:text-lg">
      <ReactMarkdown
        components={components}
        rehypePlugins={[rehypeSanitize]}
        remarkPlugins={[remarkGfm]}
        skipHtml
        urlTransform={safeMarkdownUrl}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
