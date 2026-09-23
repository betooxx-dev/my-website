import { siteProfile } from "@/config/site-profile";
import type { Locale } from "@/i18n/routing";

export function blogSeoFields(
  post: {
    title: string;
    excerpt: string;
    locale: Locale;
    slug: string;
    coverAlt?: string;
  },
  siteUrl: string,
) {
  const path = `/${post.locale}/blog/${post.slug}`;
  return {
    title: post.title,
    searchTitle: `${post.title} | ${siteProfile.name}`,
    description: post.excerpt,
    path,
    url: `${siteUrl.replace(/\/+$/, "")}${path}`,
    coverAlt: post.coverAlt?.trim() || post.title,
  };
}
