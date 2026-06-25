"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { DashboardView } from "@/components/dashboard/types";
import {
  buildDashboardContentPath,
  parseDashboardSection,
  parseDashboardView,
} from "@/lib/dashboard/navigation";

export function useDashboardUrl() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const view = useMemo(
    () => parseDashboardView(searchParams.get("view")),
    [searchParams],
  );

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
      router.replace(path, { scroll: false });
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
