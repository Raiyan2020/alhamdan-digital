"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useWatch, type FieldErrors } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "@/lib/toast";
import type { CmsHomePayload } from "@/lib/cms/types";
import { cmsHomePayloadSchema } from "@/lib/cms/validation";
import { resolveHomeSectionFromFieldPath } from "@/lib/cms/form-errors";
import { handleFormValidationFailure } from "@/lib/cms/form-submit";
import { HOME_CMS_SECTIONS } from "@/lib/cms/section-nav";
import { useSaveHomePageMutation } from "@/hooks/use-cms-mutations";
import { useDashboardUrl } from "@/hooks/use-dashboard-url";
import { getErrorMessage } from "@/lib/api/errors";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BilingualTextInput, BilingualTipTapField } from "./BilingualFields";
import { CmsSectionNav } from "./CmsSectionNav";
import { LocalizedMediaPicker } from "./LocalizedMediaPicker";
import { CheckboxFormField } from "./CheckboxFormField";
import {
  AboutCardsRepeater,
  ContactMethodsRepeater,
  CyclePhrasesRepeater,
  FooterLinksRepeater,
  MarketOutcomesRepeater,
  NavRepeater,
  ProcessStepsRepeater,
  SectorItemsRepeater,
  ServiceItemsRepeater,
  SocialLinksRepeater,
  VisionMissionRepeater,
  WhyReasonsRepeater,
} from "./HomeCmsRepeaters";

type HomeCmsFormProps = {
  initialValue: CmsHomePayload;
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

export function HomeCmsForm({ initialValue, embedded = false }: HomeCmsFormProps) {
  const t = useTranslations("cms");
  const { section: activeSection, setSection } = useDashboardUrl();
  const [message, setMessage] = useState<string | null>(null);
  const [messageVariant, setMessageVariant] = useState<"success" | "error">("success");
  const saveMutation = useSaveHomePageMutation();
  const form = useForm<CmsHomePayload>({
    resolver: zodResolver(cmsHomePayloadSchema) as never,
    defaultValues: initialValue,
    mode: "onBlur",
  });
  const ogImage = useWatch({ control: form.control, name: "seo.ogImage" });
  const sectionTitle = (key: string) => t(`home.sections.${key}`);
  const field = (key: string) => t(`home.fields.${key}`);

  const describeErrorPath = (path: string) =>
    describeHomeErrorPath(path, {
      sectionTitle,
      field,
      common: (key) => t(`common.${key}`),
    });

  const onSubmit = form.handleSubmit(
    (values) => {
      setMessage(null);
      saveMutation.mutate(values, {
        onSuccess: () => {
          const text = t("home.draftSaved");
          setMessageVariant("success");
          setMessage(text);
          toast.success(text);
        },
        onError: (error) => {
          const text = getErrorMessage(error);
          setMessageVariant("error");
          setMessage(text);
        },
      });
    },
    (errors: FieldErrors<CmsHomePayload>) => {
      const result = handleFormValidationFailure(form, errors, {
        validationMessage: (count, paths) =>
          [
            t("common.validationFailed", { count }),
            paths.slice(0, 4).map(describeErrorPath).join(" • "),
          ]
            .filter(Boolean)
            .join("\n"),
        onSectionChange: setSection,
        resolveSection: resolveHomeSectionFromFieldPath,
      });
      setMessageVariant("error");
      setMessage(result.message);
    },
  );

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
              <h1 className="text-3xl font-semibold">{t("home.title")}</h1>
            ) : (
              <h2 className="text-2xl font-semibold">{t("home.title")}</h2>
            )}
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {t("home.subtitle")}
            </p>
          </div>
          <Button type="submit" size="lg" className="shrink-0" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? t("common.saving") : t("common.saveDraft")}
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
            namespace="home"
            groups={HOME_CMS_SECTIONS}
            activeSection={activeSection}
            onSectionChange={setSection}
          />

          <div className="min-w-0 flex-1">
            {activeSection === "seo" ? (
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
                          defaultUrl: "/figma/hero-visual.webp",
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
            ) : null}

            {activeSection === "shell" ? (
              <SectionCard title={sectionTitle("shell")}>
                <BilingualTextInput control={form.control} name="header.brandName" label={field("brandName")} />
                <BilingualTextInput control={form.control} name="header.mobileSubtitle" label={field("mobileSubtitle")} />
                <BilingualTextInput control={form.control} name="header.switchToArabicLabel" label={field("switchToArabic")} />
                <BilingualTextInput control={form.control} name="header.switchToEnglishLabel" label={field("switchToEnglish")} />
                <LocalizedMediaPicker control={form.control} name="header.logo" label={field("headerLogo")} />
                <BilingualTextInput control={form.control} name="loading.label" label={field("loadingLabel")} />
                <LocalizedMediaPicker
                  control={form.control}
                  name="loading.animation"
                  label={field("loadingAnimation")}
                  accept=".lottie,application/octet-stream,application/json"
                />
              </SectionCard>
            ) : null}

            {activeSection === "nav" ? (
              <SectionCard title={sectionTitle("nav")}>
                <NavRepeater />
              </SectionCard>
            ) : null}

            {activeSection === "hero" ? (
              <SectionCard title={sectionTitle("hero")}>
                <BilingualTextInput control={form.control} name="hero.titleLine1" label={field("titleLine1")} />
                <BilingualTextInput control={form.control} name="hero.line2Prefix" label={field("titleLine2Prefix")} />
                <CyclePhrasesRepeater />
                <BilingualTipTapField control={form.control} name="hero.body" label={field("heroDescription")} />
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
                <LocalizedMediaPicker control={form.control} name="hero.personImage" label={field("heroPersonImage")} />
              </SectionCard>
            ) : null}

            {activeSection === "about" ? (
              <SectionCard title={sectionTitle("about")}>
                <BilingualTextInput control={form.control} name="about.heading" label={t("common.heading")} />
                <BilingualTipTapField control={form.control} name="about.body" label={t("common.description")} />
                <AboutCardsRepeater />
              </SectionCard>
            ) : null}

            {activeSection === "vision" ? (
              <SectionCard title={sectionTitle("vision")}>
                <VisionMissionRepeater />
              </SectionCard>
            ) : null}

            {activeSection === "process" ? (
              <SectionCard title={sectionTitle("process")}>
                <BilingualTextInput control={form.control} name="process.title" label={t("common.sectionTitle")} />
                <BilingualTipTapField control={form.control} name="process.body" label={t("common.sectionDescription")} />
                <ProcessStepsRepeater />
              </SectionCard>
            ) : null}

            {activeSection === "products" ? (
              <SectionCard title={sectionTitle("products")}>
                <BilingualTextInput control={form.control} name="products.title" label={t("common.sectionTitle")} />
                <BilingualTipTapField control={form.control} name="products.body" label={t("common.sectionDescription")} />
                <BilingualTextInput control={form.control} name="products.cta" label={t("common.ctaLabel")} />
                <FormField
                  control={form.control}
                  name="products.ctaHref"
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
                <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                  {t("productsManager.homeNotice")}
                </p>
              </SectionCard>
            ) : null}

            {activeSection === "services" ? (
              <SectionCard title={sectionTitle("services")}>
                <BilingualTextInput control={form.control} name="services.title" label={t("common.sectionTitle")} />
                <BilingualTipTapField control={form.control} name="services.body" label={t("common.sectionDescription")} />
                <BilingualTextInput control={form.control} name="services.carouselLabel" label={field("carouselLabel")} />
                <BilingualTextInput control={form.control} name="services.activeService" label={field("activeService")} />
                <BilingualTextInput control={form.control} name="services.goToService" label={field("goToService")} />
                <ServiceItemsRepeater />
              </SectionCard>
            ) : null}

            {activeSection === "sectors" ? (
              <SectionCard title={sectionTitle("sectors")}>
                <BilingualTextInput control={form.control} name="sectors.title" label={t("common.sectionTitle")} />
                <BilingualTipTapField control={form.control} name="sectors.body" label={t("common.sectionDescription")} />
                <BilingualTextInput control={form.control} name="sectors.carouselLabel" label={field("carouselLabel")} />
                <SectorItemsRepeater />
              </SectionCard>
            ) : null}

            {activeSection === "why" ? (
              <SectionCard title={sectionTitle("why")}>
                <BilingualTextInput control={form.control} name="why.title" label={t("common.sectionTitle")} />
                <WhyReasonsRepeater />
                <LocalizedMediaPicker control={form.control} name="why.phoneFrameImage" label={field("phoneFrameImage")} />
                <LocalizedMediaPicker control={form.control} name="why.screenImage" label={field("screenImage")} />
              </SectionCard>
            ) : null}

            {activeSection === "market" ? (
              <SectionCard title={sectionTitle("market")}>
                <BilingualTextInput control={form.control} name="market.title" label={t("common.sectionTitle")} />
                <BilingualTipTapField control={form.control} name="market.body1" label={field("descriptionPart1")} />
                <BilingualTipTapField control={form.control} name="market.body2" label={field("descriptionPart2")} />
                <MarketOutcomesRepeater />
                <LocalizedMediaPicker control={form.control} name="market.visualImage" label={field("marketVisualImage")} />
              </SectionCard>
            ) : null}

            {activeSection === "footer" ? (
              <SectionCard title={sectionTitle("footer")}>
                <BilingualTextInput control={form.control} name="footer.contactTitle" label={field("contactTitle")} />
                <BilingualTextInput control={form.control} name="footer.quickLinks" label={field("quickLinksTitle")} />
                <BilingualTipTapField control={form.control} name="footer.description" label={field("footerDescription")} />
                <BilingualTextInput control={form.control} name="footer.copyright" label={field("copyright")} />
                <BilingualTextInput control={form.control} name="footer.backToTop" label={field("backToTop")} />
                <BilingualTextInput control={form.control} name="footer.kuwait" label={field("kuwaitLabel")} />
                <LocalizedMediaPicker control={form.control} name="footer.logo" label={field("footerLogo")} />
                <div className="grid gap-5 rounded-xl border border-border p-5">
                  <CheckboxFormField<CmsHomePayload> name="footer.whatsappVisible" label={field("whatsappVisible")} />
                  <FormField control={form.control} name="footer.whatsappNumber" render={({ field: whatsappField }) => <FormItem><FormLabel>{field("whatsappNumber")}</FormLabel><FormControl><Input dir="ltr" placeholder="96550000000" {...whatsappField} /></FormControl><FormMessage /></FormItem>} />
                  <BilingualTextInput control={form.control} name="footer.whatsappMessage" label={field("whatsappMessage")} />
                </div>
                <FooterLinksRepeater />
                <ContactMethodsRepeater />
                <SocialLinksRepeater />
              </SectionCard>
            ) : null}
          </div>
        </div>

        <div className="flex justify-end border-t border-border/60 pt-6">
          <Button type="submit" size="lg" className="shrink-0" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? t("common.saving") : t("common.saveDraft")}
          </Button>
        </div>
      </form>
    </Form>
  );
}

function describeHomeErrorPath(
  path: string,
  labels: {
    sectionTitle: (key: string) => string;
    field: (key: string) => string;
    common: (key: string) => string;
  },
) {
  const parts = path.split(".");
  const section = labels.sectionTitle(resolveHomeSectionFromFieldPath(path));
  const itemIndex = parts.find((part) => /^\d+$/.test(part));
  const item = itemIndex ? labels.common("item").replace("{index}", String(Number(itemIndex) + 1)) : null;
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
    ["header.brandName", labels.field("brandName")],
    ["header.mobileSubtitle", labels.field("mobileSubtitle")],
    ["header.switchToArabicLabel", labels.field("switchToArabic")],
    ["header.switchToEnglishLabel", labels.field("switchToEnglish")],
    ["header.logo", labels.field("headerLogo")],
    ["loading.label", labels.field("loadingLabel")],
    ["loading.animation", labels.field("loadingAnimation")],
    ["hero.titleLine1", labels.field("titleLine1")],
    ["hero.line2Prefix", labels.field("titleLine2Prefix")],
    ["hero.body", labels.field("heroDescription")],
    ["hero.ctaHref", labels.common("ctaUrl")],
    ["hero.cta", labels.common("ctaLabel")],
    ["hero.personImage", labels.field("heroPersonImage")],
    ["about.heading", labels.common("heading")],
    ["about.body", labels.common("description")],
    ["process.title", labels.common("sectionTitle")],
    ["process.body", labels.common("sectionDescription")],
    ["products.title", labels.common("sectionTitle")],
    ["products.body", labels.common("sectionDescription")],
    ["products.ctaHref", labels.common("ctaUrl")],
    ["products.cta", labels.common("ctaLabel")],
    ["services.title", labels.common("sectionTitle")],
    ["services.body", labels.common("sectionDescription")],
    ["services.carouselLabel", labels.field("carouselLabel")],
    ["services.activeService", labels.field("activeService")],
    ["services.goToService", labels.field("goToService")],
    ["sectors.title", labels.common("sectionTitle")],
    ["sectors.body", labels.common("sectionDescription")],
    ["sectors.carouselLabel", labels.field("carouselLabel")],
    ["why.title", labels.common("sectionTitle")],
    ["why.phoneFrameImage", labels.field("phoneFrameImage")],
    ["why.screenImage", labels.field("screenImage")],
    ["market.title", labels.common("sectionTitle")],
    ["market.body1", labels.field("descriptionPart1")],
    ["market.body2", labels.field("descriptionPart2")],
    ["market.visualImage", labels.field("marketVisualImage")],
    ["footer.contactTitle", labels.field("contactTitle")],
    ["footer.quickLinks", labels.field("quickLinksTitle")],
    ["footer.description", labels.field("footerDescription")],
    ["footer.copyright", labels.field("copyright")],
    ["footer.backToTop", labels.field("backToTop")],
    ["footer.kuwait", labels.field("kuwaitLabel")],
    ["footer.logo", labels.field("footerLogo")],
  ];

  const exact = exactLabels.find(([key]) => path.startsWith(key))?.[1];
  const fallback = path.includes(".href")
    ? labels.common("url")
    : path.includes(".label") || path.includes(".phrase") || path.includes(".text")
      ? labels.common("label")
      : path.includes(".title")
        ? labels.common("heading")
        : path.includes(".body")
          ? labels.common("description")
          : path.includes(".image") || path.includes("Image")
            ? labels.common("uploadImage")
            : path.split(".").at(-1) ?? path;
  const fieldLabel = exact ?? fallback;
  const localizedField = language ? `${fieldLabel} (${language})` : fieldLabel;

  return [section, item, localizedField].filter(Boolean).join(" > ");
}
