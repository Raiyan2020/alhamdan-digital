import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getLocalizedProjects } from "@/lib/cms/project-service";
import { ProjectsIndexView } from "@/components/projects/ProjectsIndexView";

export const revalidate = 60;
export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsRoute({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ProjectsIndexView projects={await getLocalizedProjects()} />;
}
