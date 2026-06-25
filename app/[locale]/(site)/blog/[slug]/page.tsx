import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { BlogPostView } from "@/components/blog/BlogPostView";
import type { Locale } from "@/i18n/routing";
import { getPublishedBlogPostBySlug, getPublishedBlogSlugs } from "@/lib/cms/blog-service";

export const revalidate = 60;

type Props = {
  params: Promise<{ locale: Locale; slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getPublishedBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);

  if (!post) {
    return { title: "Blog" };
  }

  return {
    title: post.seo.metaTitle || post.title,
    description: post.seo.metaDescription || post.excerpt,
    openGraph: {
      title: post.seo.ogTitle || post.title,
      description: post.seo.ogDescription || post.excerpt,
      images: post.seo.ogImageUrl ? [{ url: post.seo.ogImageUrl }] : undefined,
      type: "article",
      publishedTime: post.publishedAt ?? undefined,
      authors: [post.authorName],
      tags: post.tags,
    },
    alternates: {
      canonical: locale === "ar" ? `/blog/${slug}` : `/${locale}/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getPublishedBlogPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.seo.ogImageUrl ?? post.coverImageUrl ?? undefined,
    datePublished: post.publishedAt,
    author: {
      "@type": "Person",
      name: post.authorName,
    },
    keywords: post.tags.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostView post={post} />
    </>
  );
}
