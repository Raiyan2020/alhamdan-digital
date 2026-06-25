"use client";

import Image from "next/image";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { Calendar, Clock3, User } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { BlogIndexContent, LocalizedBlogPostSummary } from "@/lib/cms/blog-types";
import { Link } from "@/i18n/navigation";

type BlogIndexProps = {
  content: BlogIndexContent;
  posts: LocalizedBlogPostSummary[];
};

export function BlogIndex({ content, posts }: BlogIndexProps) {
  const t = useTranslations("blog");
  const locale = useLocale();
  const dateLocale = locale === "ar" ? ar : enUS;

  return (
    <div className="min-h-screen bg-page text-ink">
      <section className="border-b border-border-soft bg-gradient-to-br from-[#03396c] via-[#006ab4] to-[#00bcf5] px-5 py-16 text-white sm:px-8 lg:px-12">
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
              <article
                key={post.id}
                className="group overflow-hidden rounded-3xl border border-border-soft bg-card-surface shadow-sm transition-transform hover:-translate-y-0.5"
              >
                {post.coverImageUrl ? (
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    <Image
                      src={post.coverImageUrl}
                      alt={post.coverImageAlt || post.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-[1.02]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/10] bg-gradient-to-br from-[#e6edf5] to-[#d9ecfb]" />
                )}
                <div className="space-y-4 p-6">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
                    <span className="rounded-full bg-[#e0f4fc] px-3 py-1 font-medium text-[#006ab4]">
                      {t(`categories.${post.category}`)}
                    </span>
                    {post.publishedAt ? (
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {format(new Date(post.publishedAt), "PP", { locale: dateLocale })}
                      </span>
                    ) : null}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold leading-8">
                      <Link href={`/blog/${post.slug}`} className="hover:text-brand">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-ink-muted">{post.excerpt}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-ink-muted">
                    <span className="inline-flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      {post.authorName}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-3.5 w-3.5" />
                      {t("readingTime", { minutes: post.readingTimeMinutes })}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
