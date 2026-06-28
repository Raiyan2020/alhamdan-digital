"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type {
  BlogIndexContent,
  BlogPagination,
  LocalizedBlogPostSummary,
} from "@/lib/cms/blog-types";
import { BlogCard } from "./BlogCard";

type BlogIndexProps = {
  content: BlogIndexContent;
  posts: LocalizedBlogPostSummary[];
  pagination?: BlogPagination;
};

export function BlogIndex({ content, posts, pagination }: BlogIndexProps) {
  const t = useTranslations("blog");

  return (
    <div className="min-h-screen bg-page text-ink">
      <section className="border-b border-border-soft bg-gradient-to-br from-[#03396c] via-[#006ab4] to-[#00bcf5] px-5 pb-16 pt-[calc(88px+2rem)] text-white sm:px-8 min-[1440px]:pt-[calc(128px+2rem)] lg:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-medium text-white/80">{t("index.eyebrow")}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{content.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/90">{content.description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-12">
        {posts.length === 0 ? (
          <div className="rounded-3xl border border-border-soft bg-card-surface p-10 text-center">
            <h2 className="text-xl font-semibold">{content.emptyTitle}</h2>
            <p className="mt-2 text-sm text-ink-muted">{content.emptyBody}</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {pagination && pagination.totalPages > 1 ? (
          <nav
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
            aria-label={t("pagination.label")}
          >
            <Link
              href={
                pagination.hasPreviousPage
                  ? `/blogs?page=${pagination.currentPage - 1}`
                  : "/blogs"
              }
              aria-disabled={!pagination.hasPreviousPage}
              className={
                pagination.hasPreviousPage
                  ? "inline-flex h-11 items-center gap-2 rounded-full border border-border-soft px-5 text-sm font-medium text-ink transition-colors hover:border-brand hover:text-brand"
                  : "pointer-events-none inline-flex h-11 items-center gap-2 rounded-full border border-border-soft px-5 text-sm font-medium text-ink-muted opacity-50"
              }
            >
              <ChevronLeft className="h-4 w-4" />
              {t("pagination.previous")}
            </Link>
            <span className="text-sm text-ink-muted">
              {t("pagination.pageStatus", {
                page: pagination.currentPage,
                total: pagination.totalPages,
              })}
            </span>
            <Link
              href={`/blogs?page=${pagination.currentPage + 1}`}
              aria-disabled={!pagination.hasNextPage}
              className={
                pagination.hasNextPage
                  ? "inline-flex h-11 items-center gap-2 rounded-full border border-border-soft px-5 text-sm font-medium text-ink transition-colors hover:border-brand hover:text-brand"
                  : "pointer-events-none inline-flex h-11 items-center gap-2 rounded-full border border-border-soft px-5 text-sm font-medium text-ink-muted opacity-50"
              }
            >
              {t("pagination.next")}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </nav>
        ) : null}
      </section>
    </div>
  );
}
