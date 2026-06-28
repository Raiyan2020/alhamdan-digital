"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { DashboardView } from "@/components/dashboard/types";
import {
  buildDashboardContentPath,
  DASHBOARD_VIEW_PATHS,
  parseDashboardSection,
} from "@/lib/dashboard/navigation";

function viewFromPathname(pathname: string): DashboardView {
  const cleanPath = pathname.replace(/\/$/, "") || "/";
  const match = (Object.entries(DASHBOARD_VIEW_PATHS) as Array<[DashboardView, string]>)
    .find(([, path]) => path === cleanPath);
  return match?.[0] ?? "overview";
}

export function useDashboardUrl() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const view = useMemo(() => viewFromPathname(pathname), [pathname]);

  const section = useMemo(
    () => parseDashboardSection(view, searchParams.get("section")),
    [searchParams, view],
  );

  const replaceDashboardUrl = useCallback(
    (nextView: DashboardView, nextSection?: string | null) => {
      const path = buildDashboardContentPath(
        nextView,
        nextSection ?? (nextView === view ? section : null),
      );
      router.push(path, { scroll: false });
    },
    [router, section, view],
  );

  const setView = useCallback(
    (nextView: DashboardView) => {
      replaceDashboardUrl(nextView);
    },
    [replaceDashboardUrl],
  );

  const setSection = useCallback(
    (nextSection: string) => {
      replaceDashboardUrl(view, nextSection);
    },
    [replaceDashboardUrl, view],
  );

  return { view, section, setView, setSection };
}
