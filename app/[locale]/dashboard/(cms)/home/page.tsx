import { HomeCmsForm } from "@/components/cms/HomeCmsForm";
import { getCmsHomePayload } from "@/lib/cms/service";

export default async function DashboardHomePage() {
  const homePayload = await getCmsHomePayload();

  return <HomeCmsForm initialValue={homePayload} embedded />;
}
