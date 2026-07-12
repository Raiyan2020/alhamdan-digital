"use client";

import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { ArrowLeft, Calendar, Clock3, User } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { LocalizedBlogPost } from "@/lib/cms/blog-types";
import { RichTextHtml } from "@/lib/cms/rich-text";
import { Link } from "@/i18n/navigation";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

type BlogPostViewProps = {
  post: LocalizedBlogPost;
};

export function BlogPostView({ post }: BlogPostViewProps) {
  const t = useTranslations("blog");
  const locale = useLocale();
  const dateLocale = locale === "ar" ? ar : enUS;

  return (
    <article className="min-h-screen bg-page text-ink">
      <div className="border-b border-border-soft bg-card-surface">
        <div className="mx-auto flex max-w-4xl items-center px-5 py-5 sm:px-8">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("backToBlog")}
          </Link>
        </div>
      </div>

      <header className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-12">
        <div className="flex flex-wrap items-center gap-3 text-sm text-ink-muted">
          <span className="rounded-full bg-[#e0f4fc] px-3 py-1 font-medium text-[#006ab4]">
            {t(`categories.${post.category}`)}
          </span>
          {post.publishedAt ? (
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {format(new Date(post.publishedAt), "PPP", { locale: dateLocale })}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="h-4 w-4" />
            {t("readingTime", { minutes: post.readingTimeMinutes })}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <User className="h-4 w-4" />
            {post.authorName}
          </span>
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          {post.title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-ink-muted">{post.excerpt}</p>
        {post.tags.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border-soft px-3 py-1 text-xs font-medium text-ink-muted"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </header>

      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-muted shadow-lg">
          <ImageWithFallback src={post.coverImageUrl} alt={post.coverImageAlt || post.title} fill className="object-contain p-8" priority sizes="(max-width: 1024px) 100vw, 1024px" />
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-12">
        <RichTextHtml
          html={post.body}
          className="prose prose-lg max-w-none text-ink prose-headings:text-ink prose-a:text-brand"
        />
      </div>
    </article>
  );
}
