import type { ReactNode } from "react";
import { ZodLocaleProvider } from "@/components/providers/ZodLocaleProvider";

/**
 * Al Hamdan brand dashboard palette (see app/globals.css `.dashboard-theme`).
 * Navy #03396c · Blue #006ab4 · Cyan #00bcf5 · Red #e9314c · Charcoal #272424
 */
export const dashboardBrandColors = {
  canvas: "dashboard-canvas",
  surface: "dashboard-surface",
  sand: "dashboard-sand",
  gulf: "dashboard-gulf",
  gulfLight: "dashboard-gulf-light",
  palm: "dashboard-palm",
  palmLight: "dashboard-palm-light",
  dune: "dashboard-dune",
  duneLight: "dashboard-dune-light",
  coral: "dashboard-coral",
  coralLight: "dashboard-coral-light",
} as const;

type DashboardShellProps = {
  children: ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="dashboard-theme min-h-screen w-full overflow-x-clip">
      <ZodLocaleProvider>{children}</ZodLocaleProvider>
    </div>
  );
}
