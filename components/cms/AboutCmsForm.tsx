"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import type { CmsAboutPayload } from "@/lib/cms/types";
import { normalizeAboutPayloadForSubmit, coalesceAboutPayloadForSubmit } from "@/lib/cms/about-storage";
import { cmsAboutPayloadSchema } from "@/lib/cms/validation";
import { resolveAboutSectionFromFieldPath } from "@/lib/cms/form-errors";
import { ABOUT_CMS_SECTIONS } from "@/lib/cms/section-nav";
import { useSaveAboutPageMutation } from "@/hooks/use-cms-mutations";
import { useDashboardUrl } from "@/hooks/use-dashboard-url";
import { getErrorMessage } from "@/lib/api/errors";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AboutProductsSection } from "./AboutProductsSection";
import { BilingualTextInput, BilingualTipTapField } from "./BilingualFields";
import { CmsSectionNav } from "./CmsSectionNav";
import { LocalizedMediaPicker } from "./LocalizedMediaPicker";

type AboutCmsFormProps = {
  initialValue: CmsAboutPayload;
  embedded?: boolean;
};

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-border/70 bg-dashboard-surface shadow-dashboard">
      <CardHeader className="border-b border-border/50 px-6 py-5 sm:px-8">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 px-6 py-6 sm:gap-7 sm:px-8 sm:py-8">
        {children}
      </CardContent>
    </Card>
  );
}

export function AboutCmsForm({ initialValue, embedded = false }: AboutCmsFormProps) {
  const t = useTranslations("cms");
  const router = useRouter();
  const { section: activeSection, setSection } = useDashboardUrl();
  const [message, setMessage] = useState<string | null>(null);
  const [messageVariant, setMessageVariant] = useState<"success" | "error">("success");
  const saveMutation = useSaveAboutPageMutation();
  const form = useForm<CmsAboutPayload>({
    resolver: zodResolver(cmsAboutPayloadSchema) as never,
    defaultValues: initialValue,
    mode: "onBlur",
    shouldUnregister: false,
  });
  const ogImage = useWatch({ control: form.control, name: "seo.ogImage" });
  const sectionTitle = (key: string) => t(`about.sections.${key}`);
  const field = (key: string) => t(`about.fields.${key}`);

  useEffect(() => {
    if (!form.formState.isDirty && !saveMutation.isPending) {
      form.reset(initialValue);
    }
  }, [initialValue, form, saveMutation.isPending, form.formState.isDirty]);

  const describeErrorPath = (path: string) =>
    describeAboutErrorPath(path, {
      sectionTitle,
      field,
      common: (key, values) => t(`common.${key}`, values),
      productItem: (index) => t("about.repeaters.product", { index }),
    });

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    const payload = normalizeAboutPayloadForSubmit(
      coalesceAboutPayloadForSubmit(form.getValues(), initialValue),
    );
    const parsed = cmsAboutPayloadSchema.safeParse(payload);

    if (!parsed.success) {
      const paths = parsed.error.issues.map((issue) => issue.path.join("."));
      const firstPath = paths[0] ?? null;
      const text = [
        t("common.validationFailed", { count: paths.length }),
        paths.slice(0, 4).map(describeErrorPath).join(" • "),
      ]
        .filter(Boolean)
        .join("\n");

      if (firstPath) {
        setSection(resolveAboutSectionFromFieldPath(firstPath));
      }

      toast.error(text);
      setMessageVariant("error");
      setMessage(text);
      return;
    }

    saveMutation.mutate(parsed.data as CmsAboutPayload, {
      onSuccess: (response) => {
        const saved = (response.content as CmsAboutPayload | undefined) ?? parsed.data;
        const text = t("about.draftSaved");
        setMessageVariant("success");
        setMessage(text);
        toast.success(text);
        form.reset(saved);
        router.refresh();
      },
      onError: (error) => {
        const text = getErrorMessage(error);
        setMessageVariant("error");
        setMessage(text);
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className={cn(
          "grid gap-8",
          embedded &&
            "rounded-[28px] border border-border/70 bg-dashboard-surface p-6 shadow-dashboard sm:p-8 lg:p-10",
        )}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            {!embedded ? (
              <h1 className="text-3xl font-semibold">{t("about.title")}</h1>
            ) : (
              <h2 className="text-2xl font-semibold">{t("about.title")}</h2>
            )}
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {t("about.subtitle")}
            </p>
          </div>
          <Button type="submit" size="lg" className="shrink-0" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? t("common.saving") : t("common.saveAboutDraft")}
          </Button>
        </div>

        {message ? (
          <div
            className={cn(
              "rounded-xl border px-5 py-4 text-sm",
              messageVariant === "error"
                ? "border-destructive/40 bg-destructive/10 text-destructive"
                : "border-border bg-muted/50",
            )}
          >
            {message}
          </div>
        ) : null}

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10 xl:gap-12">
          <CmsSectionNav
            namespace="about"
            groups={ABOUT_CMS_SECTIONS}
            activeSection={activeSection}
            onSectionChange={setSection}
          />

          <div className="min-w-0 flex-1">
            <div className={cn(activeSection !== "seo" && "hidden")} aria-hidden={activeSection !== "seo"}>
              <SectionCard title={sectionTitle("seo")}>
                <BilingualTextInput control={form.control} name="seo.metaTitle" label={field("metaTitle")} />
                <BilingualTextInput control={form.control} name="seo.metaDescription" label={field("metaDescription")} />
                <BilingualTextInput control={form.control} name="seo.ogTitle" label={field("ogTitle")} />
                <BilingualTextInput control={form.control} name="seo.ogDescription" label={field("ogDescription")} />
                {ogImage ? (
                  <div className="grid gap-4">
                    <LocalizedMediaPicker control={form.control} name="seo.ogImage" label={field("ogImage")} />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => form.setValue("seo.ogImage", null, { shouldDirty: true })}
                    >
                      {t("common.clearOgImage")}
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      form.setValue(
                        "seo.ogImage",
                        {
                          defaultAssetId: null,
                          defaultUrl: "/figma/market-visual.webp",
                          alt: { ar: "Al Hamdan Digital", en: "Al Hamdan Digital" },
                          isDecorative: false,
                        },
                        { shouldDirty: true },
                      )
                    }
                  >
                    {t("common.addOgImage")}
                  </Button>
                )}
              </SectionCard>
            </div>

            <div className={cn(activeSection !== "hero" && "hidden")} aria-hidden={activeSection !== "hero"}>
              <SectionCard title={sectionTitle("hero")}>
                <BilingualTextInput control={form.control} name="hero.title" label={field("title")} />
                <BilingualTipTapField control={form.control} name="hero.body" label={t("common.description")} />
                <BilingualTextInput control={form.control} name="hero.cta" label={t("common.ctaLabel")} />
                <FormField
                  control={form.control}
                  name="hero.ctaHref"
                  render={({ field: hrefField }) => (
                    <FormItem>
                      <FormLabel>{t("common.ctaUrl")}</FormLabel>
                      <FormControl>
                        <Input dir="ltr" {...hrefField} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </SectionCard>
            </div>

            <div className={cn(activeSection !== "products" && "hidden")} aria-hidden={activeSection !== "products"}>
              <SectionCard title={t("about.repeaters.productSections")}>
                <AboutProductsSection />
              </SectionCard>
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-border/60 pt-6">
          <Button type="submit" size="lg" className="shrink-0" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? t("common.saving") : t("common.saveAboutDraft")}
          </Button>
        </div>
      </form>
    </Form>
  );
}

function describeAboutErrorPath(
  path: string,
  labels: {
    sectionTitle: (key: string) => string;
    field: (key: string) => string;
    common: (key: string, values?: Record<string, string | number>) => string;
    productItem: (index: number) => string;
  },
) {
  const parts = path.split(".");
  const section = labels.sectionTitle(resolveAboutSectionFromFieldPath(path));
  const itemIndex = parts.find((part) => /^\d+$/.test(part));
  const item =
    itemIndex && parts[0] === "products"
      ? labels.productItem(Number(itemIndex) + 1)
      : itemIndex
        ? labels.common("item", { index: Number(itemIndex) + 1 })
        : null;
  const language = parts.includes("ar")
    ? labels.common("arabic")
    : parts.includes("en")
      ? labels.common("english")
      : null;

  const exactLabels: Array<[string, string]> = [
    ["seo.metaTitle", labels.field("metaTitle")],
    ["seo.metaDescription", labels.field("metaDescription")],
    ["seo.ogTitle", labels.field("ogTitle")],
    ["seo.ogDescription", labels.field("ogDescription")],
    ["seo.ogImage", labels.field("ogImage")],
    ["hero.title", labels.field("title")],
    ["hero.body", labels.common("description")],
    ["hero.ctaHref", labels.common("ctaUrl")],
    ["hero.cta", labels.common("ctaLabel")],
  ];

  const exact = exactLabels.find(([key]) => path.startsWith(key))?.[1];
  const fallback = path.includes(".href")
    ? labels.common("url")
    : path.includes(".label")
      ? labels.common("label")
      : path.includes(".title")
        ? labels.common("heading")
        : path.includes(".body")
          ? labels.common("description")
          : path.includes(".image")
            ? labels.field("productImage")
            : path.split(".").at(-1) ?? path;
  const fieldLabel = exact ?? fallback;
  const localizedField = language ? `${fieldLabel} (${language})` : fieldLabel;

  return [section, item, localizedField].filter(Boolean).join(" > ");
}
