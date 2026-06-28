import { AboutCmsForm } from "@/components/cms/AboutCmsForm";
import { getCmsAboutPayload } from "@/lib/cms/service";

export default async function DashboardAboutPage() {
  const aboutPayload = await getCmsAboutPayload();

  return <AboutCmsForm initialValue={aboutPayload} embedded />;
}
