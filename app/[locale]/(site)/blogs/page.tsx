import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { BlogIndex } from "@/components/blog/BlogIndex";
import type { Locale } from "@/i18n/routing";
import { getBlogIndexContent, getPublishedBlogSummariesPage } from "@/lib/cms/blog-service";

export const revalidate = 60;

const BLOG_PAGE_SIZE = 6;

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ page?: string | string[] }>;
};

function parsePage(value: string | string[] | undefined) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const page = Number.parseInt(rawValue ?? "1", 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { page } = await searchParams;
  const requestedPage = parsePage(page);
  const content = await getBlogIndexContent();
  const canonicalPath = requestedPage > 1 ? `/blogs?page=${requestedPage}` : "/blogs";

  return {
    title: content.title,
    description: content.description,
    openGraph: {
      title: content.title,
      description: content.description,
    },
    alternates: {
      canonical: locale === "ar" ? canonicalPath : `/${locale}${canonicalPath}`,
    },
  };
}

export default async function BlogsIndexPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { page } = await searchParams;
  setRequestLocale(locale);

  const [content, result] = await Promise.all([
    getBlogIndexContent(),
    getPublishedBlogSummariesPage(parsePage(page), BLOG_PAGE_SIZE),
  ]);

  return <BlogIndex content={content} posts={result.posts} pagination={result.pagination} />;
}
