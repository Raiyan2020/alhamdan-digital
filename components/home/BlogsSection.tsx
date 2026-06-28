"use client";

import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { LocalizedBlogPostSummary } from "@/lib/cms/blog-types";
import { cn } from "@/lib/utils";
import { BlogCard } from "../blog/BlogCard";
import { Reveal, MotionLinkButton } from "@/components/motion";

type BlogsSectionProps = {
  posts: LocalizedBlogPostSummary[];
  className?: string;
  id?: string;
};

export function BlogsSection({ posts, className, id }: BlogsSectionProps) {
  const t = useTranslations("blog.home");

  return (
    <section id={id} data-ar className={cn("bg-page text-ink", className)}>
      <div className="mx-auto w-full max-w-7xl px-5 lg:px-20">
        <Reveal
          variant="section-heading"
          className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
              {t("eyebrow")}
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl lg:text-[44px]">
              {t("title")}
            </h2>
            <p className="mt-4 text-base leading-7 text-ink-muted sm:text-lg">
              {t("description")}
            </p>
          </div>
          <MotionLinkButton
            href="/blogs"
            className="inline-flex h-12 items-center gap-2 rounded-2xl border border-border-soft bg-card-surface px-5 text-sm font-semibold text-ink shadow-sm transition-colors hover:border-brand hover:text-brand"
          >
            {t("viewAll")}
            <ArrowUpRight className="h-4 w-4" />
          </MotionLinkButton>
        </Reveal>

        {posts.length > 0 ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post, index) => (
              <Reveal key={post.id} variant="fade-up" delay={index * 80}>
                <BlogCard post={post} imagePriority={index === 0} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-border-soft bg-card-surface p-8 text-center">
            <p className="text-sm text-ink-muted">{t("empty")}</p>
            <Link href="/blogs" className="mt-3 inline-flex text-sm font-semibold text-brand">
              {t("viewAll")}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
