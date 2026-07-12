import { getCmsAboutPayload } from "@/lib/cms/service";
import { ProductEditorView } from "@/components/cms/ProductEditorView";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

export default async function DashboardProductEditPage({ params }: Props) {
  const { id } = await params;
  const payload = await getCmsAboutPayload();
  const product = payload.products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return <ProductEditorView initialPayload={payload} productId={id} />;
}
