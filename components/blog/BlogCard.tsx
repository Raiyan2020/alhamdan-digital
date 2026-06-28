"use client";

import Image from "next/image";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { Calendar, Clock3, User } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { LocalizedBlogPostSummary } from "@/lib/cms/blog-types";
import { cn } from "@/lib/utils";

type BlogCardProps = {
  post: LocalizedBlogPostSummary;
  className?: string;
  imagePriority?: boolean;
};

export function BlogCard({ post, className, imagePriority = false }: BlogCardProps) {
  const t = useTranslations("blog");
  const locale = useLocale();
  const dateLocale = locale === "ar" ? ar : enUS;

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-3xl border border-border-soft bg-card-surface shadow-sm transition-transform hover:-translate-y-0.5",
        className,
      )}
    >
      <Link href={`/blogs/${post.slug}`} className="block" aria-label={post.title}>
        {post.coverImageUrl ? (
          <div className="relative aspect-[16/10] overflow-hidden bg-muted">
            <Image
              src={post.coverImageUrl}
              alt={post.coverImageAlt || post.title}
              fill
              className="object-cover transition-transform group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority={imagePriority}
            />
          </div>
        ) : (
          <div className="aspect-[16/10] bg-gradient-to-br from-[#e6edf5] to-[#d9ecfb]" />
        )}
      </Link>
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
            <Link href={`/blogs/${post.slug}`} className="hover:text-brand">
              {post.title}
            </Link>
          </h2>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-ink-muted">
            {post.excerpt}
          </p>
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
  );
}
