import { getCmsAboutPayload, getCmsHomePayload } from "@/lib/cms/service";
import { DashboardWorkspace } from "@/components/dashboard/DashboardWorkspace";

export default async function DashboardOverviewPage() {
  const [homePayload, aboutPayload] = await Promise.all([
    getCmsHomePayload(),
    getCmsAboutPayload(),
  ]);

  return (
    <DashboardWorkspace
      homePayload={homePayload}
      aboutPayload={aboutPayload}
    />
  );
}
