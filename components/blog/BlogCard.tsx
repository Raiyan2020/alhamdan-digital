"use client";

import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { Calendar, Clock3, User } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { LocalizedBlogPostSummary } from "@/lib/cms/blog-types";
import { cn } from "@/lib/utils";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

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
        "group flex h-full flex-col overflow-hidden rounded-3xl border border-border-soft bg-card-surface shadow-sm transition-transform hover:-translate-y-0.5",
        className,
      )}
    >
      <Link href={`/blogs/${post.slug}`} className="block shrink-0" aria-label={post.title}>
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          <ImageWithFallback
            src={post.coverImageUrl}
            alt={post.coverImageAlt || post.title}
            fill
            className="object-contain p-5 transition-transform group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={imagePriority}
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="space-y-4">
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
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-ink-muted pt-4">
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
