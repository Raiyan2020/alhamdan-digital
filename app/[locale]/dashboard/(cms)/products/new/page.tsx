import { getCmsAboutPayload } from "@/lib/cms/service";
import { ProductEditorView } from "@/components/cms/ProductEditorView";

export default async function DashboardProductNewPage() {
  const payload = await getCmsAboutPayload();
  return <ProductEditorView initialPayload={payload} />;
}
