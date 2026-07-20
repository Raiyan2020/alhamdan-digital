"use client";

import { useForm, type FieldPath } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";
import { useState } from "react";
import type { CmsAboutPayload } from "@/lib/cms/types";
import { aboutProductSchema } from "@/lib/cms/validation";
import { createDefaultAboutProduct } from "@/lib/cms/about-product-defaults";
import { useSaveAboutPageMutation } from "@/hooks/use-cms-mutations";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AboutProductFields } from "./AboutProductsSection";

type ProductEditorViewProps = {
  initialPayload: CmsAboutPayload;
  productId?: string;
};

function resolveTabFromPath(path: string[]): string {
  const joined = path.join(".");

  if (
    joined.includes("offers") ||
    joined.includes("audience") ||
    joined.includes("downloadTitle") ||
    joined.includes("storeButtons")
  ) {
    return "stores";
  }

  if (
    joined.includes("detailPage.enabled") ||
    joined.includes("detailPage.slug") ||
    joined.includes("detailPage.tagline") ||
    joined.includes("detailPage.overview") ||
    joined.includes("detailPage.whatsappHref") ||
    joined.includes("detailPage.detailCta") ||
    joined.includes("detailPage.mockupMedia") ||
    joined.includes("detailPage.mockupVideoUrl") ||
    joined.includes("detailPage.mockupVisible")
  ) {
    return "detail";
  }

  if (
    joined.includes("detailPage.highlights") ||
    joined.includes("detailPage.stats") ||
    joined.includes("detailPage.gallery") ||
    joined.includes("detailPage.useCase")
  ) {
    return "features";
  }

  if (
    joined.includes("detailPage.comparisonRows") ||
    joined.includes("detailPage.testimonials") ||
    joined.includes("detailPage.faqs") ||
    joined.includes("detailPage.comparisonVisible") ||
    joined.includes("detailPage.testimonialsVisible") ||
    joined.includes("detailPage.faqsVisible")
  ) {
    return "interactive";
  }

  if (
    joined.includes("detailPage.seo") ||
    joined.includes("detailPage.launchOffer") ||
    joined.includes("featuredInProjects") ||
    joined.includes("projectCard")
  ) {
    return "seo";
  }

  return "basic";
}

export function ProductEditorView({ initialPayload, productId }: ProductEditorViewProps) {
  const t = useTranslations("cms");
  const locale = useLocale();
  const router = useRouter();
  const saveMutation = useSaveAboutPageMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  // Determine index and prep payload
  let productIndex = initialPayload.products.findIndex((p) => p.id === productId);
  const formDefaultValues = { ...initialPayload };

  if (productIndex === -1) {
    // Creation mode
    const newProduct = createDefaultAboutProduct(initialPayload.products.length);
    formDefaultValues.products = [...initialPayload.products, newProduct];
    productIndex = initialPayload.products.length;
  }

  const form = useForm<CmsAboutPayload>({
    defaultValues: formDefaultValues,
    mode: "onBlur",
  });

  const onSubmit = (values: CmsAboutPayload) => {
    setIsSubmitting(true);
    const productValue = values.products[productIndex];

    // Validate ONLY this specific product
    const parsed = aboutProductSchema.safeParse(productValue);
    if (!parsed.success) {
      // Map validation errors back to react-hook-form
      parsed.error.issues.forEach((issue) => {
        const path = `products.${productIndex}.${issue.path.join(".")}` as FieldPath<CmsAboutPayload>;
        form.setError(path, {
          type: "manual",
          message: issue.message,
        });
      });

      // Resolve target tab for the first error
      const firstIssue = parsed.error.issues[0];
      if (firstIssue) {
        const targetTab = resolveTabFromPath(firstIssue.path.map(String));
        setActiveTab(targetTab);
      }

      setIsSubmitting(false);

      // Scroll and focus first error input
      setTimeout(() => {
        const firstErrorEl = document.querySelector("[aria-invalid='true']");
        if (firstErrorEl) {
          firstErrorEl.scrollIntoView({ behavior: "smooth", block: "center" });
          if (
            firstErrorEl instanceof HTMLInputElement ||
            firstErrorEl instanceof HTMLTextAreaElement ||
            firstErrorEl instanceof HTMLSelectElement
          ) {
            firstErrorEl.focus();
          }
        }
      }, 150);
      return;
    }

    // Submit full CmsAboutPayload draft
    saveMutation.mutate(values, {
      onSuccess: () => {
        toast.success(t("about.draftSaved"));
        router.push(`/${locale}/dashboard/products`);
        router.refresh();
      },
      onError: () => {
        setIsSubmitting(false);
      },
    });
  };

  const handleCancel = () => {
    router.push(`/${locale}/dashboard/products`);
  };

  const isCreating = !productId;

  const watchedTitle = form.watch(`products.${productIndex}.title`);
  const productName =
    (locale === "ar" ? watchedTitle?.ar : watchedTitle?.en)?.trim() ||
    watchedTitle?.ar?.trim() ||
    watchedTitle?.en?.trim() ||
    t("about.repeaters.product", { index: productIndex + 1 });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-5xl mx-auto py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold">
              {isCreating
                ? t("about.productsUi.createTitle")
                : t("about.productsUi.editTitle", { name: productName })}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isCreating
                ? t("about.productsUi.createDialogHint")
                : t("about.productsUi.editDialogHint")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              {t("about.productsUi.cancel") || "Cancel"}
            </Button>
            <Button type="submit" disabled={isSubmitting || saveMutation.isPending}>
              {isSubmitting || saveMutation.isPending ? t("common.saving") : t("common.saveAboutDraft") || "Save"}
            </Button>
          </div>
        </div>

        <Card className="border-border/70 bg-dashboard-surface shadow-dashboard">
          <CardHeader className="border-b border-border/50 px-6 py-5 sm:px-8">
            <CardTitle className="text-lg">
              {isCreating
                ? t("about.productsUi.createTitle")
                : t("about.productsUi.editTitle", { name: productName })}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-6 sm:px-8 sm:py-8">
            <AboutProductFields
              index={productIndex}
              activeTab={activeTab}
              onActiveTabChange={setActiveTab}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 border-t border-border/60 pt-6">
          <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            {t("about.productsUi.cancel") || "Cancel"}
          </Button>
          <Button type="submit" disabled={isSubmitting || saveMutation.isPending}>
            {isSubmitting || saveMutation.isPending ? t("common.saving") : t("common.saveAboutDraft") || "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
