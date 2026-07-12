import { AboutCmsForm } from "@/components/cms/AboutCmsForm";
import { getCmsAboutPayload } from "@/lib/cms/service";

export default async function DashboardProductsPage() {
  const payload = await getCmsAboutPayload();
  return <AboutCmsForm initialValue={payload} embedded productsOnly />;
}
