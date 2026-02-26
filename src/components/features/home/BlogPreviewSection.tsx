import { getLocale, getTranslations } from "next-intl/server";
import SectionHeader from "@/components/shared/SectionHeader";
import StaggerContainer from "@/components/shared/StaggerContainer";
import StaggerItem from "@/components/shared/StaggerItem";
import { blogPosts } from "@/data/blog-posts";
import { Link } from "@/i18n/navigation";
import BlogPostCard from "./BlogPostCard";

export default async function BlogPreviewSection() {
  const t = await getTranslations("blog");
  const locale = await getLocale();

  const featured = blogPosts.find((p) => p.featured);
  const secondary = blogPosts.filter((p) => !p.featured);

  return (
    <section className="relative -mt-10 rounded-t-[2.5rem] bg-pine-700 pb-24 pt-32 md:-mt-14 md:rounded-t-[3rem] md:pb-32 md:pt-36">
      {/* Top separator */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-mint-50/30 to-transparent" />

      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          number={t("sectionNumber")}
          label={t("sectionLabel")}
          title={t("sectionTitle")}
        />

        <StaggerContainer className="grid gap-6 md:grid-cols-12">
          {/* Featured post */}
          {featured && (
            <StaggerItem className="md:col-span-6">
              <BlogPostCard
                slug={featured.slug}
                title={t(`items.${featured.slug}.title`)}
                excerpt={t(`items.${featured.slug}.excerpt`)}
                category={t(`items.${featured.slug}.category`)}
                date={featured.date}
                image={featured.image}
                locale={locale}
                featured
              />
            </StaggerItem>
          )}

          {/* Secondary posts */}
          <div className="flex flex-col gap-6 md:col-span-6">
            {secondary.map((post) => (
              <StaggerItem key={post.slug}>
                <BlogPostCard
                  slug={post.slug}
                  title={t(`items.${post.slug}.title`)}
                  excerpt={t(`items.${post.slug}.excerpt`)}
                  category={t(`items.${post.slug}.category`)}
                  date={post.date}
                  locale={locale}
                />
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-mono text-sm text-mint-50/90 transition-colors hover:text-mint-50"
          >
            {t("viewAll")}
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
