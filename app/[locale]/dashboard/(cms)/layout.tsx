import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getAdminSession } from "@/lib/auth/session";

export default async function DashboardCmsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/dashboard/login");
  }

  return children;
}
