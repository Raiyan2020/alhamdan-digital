import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { ProjectPageView } from "@/components/projects/ProjectPageView";
import type { Locale } from "@/i18n/routing";
import { getEnabledProjectSlugs, getLocalizedProjectBySlug } from "@/lib/cms/project-service";

export const revalidate = 60;

type Props = {
  params: Promise<{ locale: Locale; slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getEnabledProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getLocalizedProjectBySlug(slug);

  if (!project) {
    return { title: "Project" };
  }

  return {
    title: project.seo.metaTitle || project.title,
    description: project.seo.metaDescription || project.body.replace(/<[^>]+>/g, " ").slice(0, 160),
    openGraph: {
      title: project.seo.ogTitle || project.title,
      description: project.seo.ogDescription || project.tagline,
      images: project.seo.ogImageUrl ? [{ url: project.seo.ogImageUrl }] : undefined,
      type: "website",
    },
  };
}

export default async function ProjectRoute({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = await getLocalizedProjectBySlug(slug);
  if (!project) notFound();

  return <ProjectPageView project={project} />;
}
