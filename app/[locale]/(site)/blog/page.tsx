import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { BlogIndex } from "@/components/blog/BlogIndex";
import type { Locale } from "@/i18n/routing";
import { getBlogIndexContent, getPublishedBlogSummaries } from "@/lib/cms/blog-service";

export const revalidate = 60;

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const content = await getBlogIndexContent();

  return {
    title: content.title,
    description: content.description,
    openGraph: {
      title: content.title,
      description: content.description,
    },
    alternates: {
      canonical: locale === "ar" ? "/blog" : `/${locale}/blog`,
    },
  };
}

export default async function BlogIndexPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [content, posts] = await Promise.all([
    getBlogIndexContent(),
    getPublishedBlogSummaries(),
  ]);

  return <BlogIndex content={content} posts={posts} />;
}
