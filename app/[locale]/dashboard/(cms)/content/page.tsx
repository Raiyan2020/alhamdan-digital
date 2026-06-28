import { redirect } from "next/navigation";
import {
  buildDashboardContentPath,
  parseDashboardView,
} from "@/lib/dashboard/navigation";

type Props = {
  searchParams: Promise<{ view?: string | string[]; section?: string | string[] }>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LegacyDashboardContentPage({ searchParams }: Props) {
  const params = await searchParams;
  const view = parseDashboardView(firstParam(params.view));
  const section = firstParam(params.section);

  redirect(buildDashboardContentPath(view, section));
}
