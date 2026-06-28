import { redirect } from "next/navigation";
import { AdminProfileForm } from "@/components/dashboard/AdminProfileForm";
import { getAdminSession } from "@/lib/auth/session";

export default async function DashboardProfilePage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/dashboard/login");
  }

  return (
    <AdminProfileForm
      admin={{
        name: session.name,
        email: session.email,
      }}
    />
  );
}
