import { ABOUT_CMS_SECTIONS, HOME_CMS_SECTIONS } from "@/lib/cms/section-nav";
import type { DashboardView } from "@/components/dashboard/types";

const DASHBOARD_VIEWS = ["overview", "home", "about", "blog"] as const satisfies readonly DashboardView[];

export function isDashboardView(value: string | null | undefined): value is DashboardView {
  return Boolean(value && DASHBOARD_VIEWS.includes(value as DashboardView));
}

export function parseDashboardView(value: string | null | undefined): DashboardView {
  return isDashboardView(value) ? value : "overview";
}

function sectionsForView(view: DashboardView) {
  if (view === "home") {
    return HOME_CMS_SECTIONS.flatMap((group) => [...group.items]);
  }
  if (view === "about") {
    return ABOUT_CMS_SECTIONS.flatMap((group) => [...group.items]);
  }
  return [];
}

export function parseDashboardSection(view: DashboardView, value: string | null | undefined) {
  const allowed = sectionsForView(view);
  if (value && allowed.includes(value)) return value;
  return allowed[0] ?? "seo";
}

export function buildDashboardContentPath(
  view: DashboardView,
  section?: string | null,
) {
  const params = new URLSearchParams();

  if (view !== "overview") {
    params.set("view", view);
  }

  if (view === "home" || view === "about") {
    params.set("section", parseDashboardSection(view, section ?? null));
  }

  const query = params.toString();
  return query ? `/dashboard/content?${query}` : "/dashboard/content";
}
