"use client";

import Image from "next/image";
import { isValidImageSrc } from "@/lib/media/image-url";
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import type { CmsAboutPayload } from "@/lib/cms/types";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BilingualTextInput, BilingualTipTapField } from "./BilingualFields";
import { CheckboxFormField } from "./CheckboxFormField";
import { LocalizedMediaPicker } from "./LocalizedMediaPicker";
import { SlugInput } from "@/components/ui/slug-input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type AboutProductsSectionProps = {
  onProductDeleted?: (title: string) => void;
};

export function AboutProductsSection({
  onProductDeleted,
}: AboutProductsSectionProps) {
  const t = useTranslations("cms");
  const locale = useLocale();
  const form = useFormContext<CmsAboutPayload>();
  const products = useFieldArray({
    control: form.control,
    name: "products",
    keyName: "fieldId",
  });

  const router = useRouter();
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const watchedProducts = useWatch({
    control: form.control,
    name: "products",
  });

  function openCreate() {
    router.push(`/${locale}/dashboard/products/new`);
  }

  function openEdit(index: number) {
    const productVal = form.getValues(`products.${index}`);
    router.push(`/${locale}/dashboard/products/${productVal.id}`);
  }

  function confirmDelete() {
    if (deleteIndex === null) return;
    const deletedTitle = getProductTitle(deleteIndex);
    products.remove(deleteIndex);
    setDeleteIndex(null);
    onProductDeleted?.(deletedTitle);
  }

  function getProductTitle(index: number) {
    const product = watchedProducts?.[index];
    if (!product) return t("about.repeaters.product", { index: index + 1 });
    const title = locale === "ar" ? product.title.ar : product.title.en;
    return title.trim() || t("about.repeaters.product", { index: index + 1 });
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{t("about.productsUi.hint")}</p>
        <Button type="button" variant="outline" onClick={openCreate}>
          <Plus className="me-2 h-4 w-4" />
          {t("common.addProduct")}
        </Button>
      </div>

      {products.fields.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 px-6 py-12 text-center">
          <p className="text-sm text-muted-foreground">{t("about.productsUi.empty")}</p>
          <Button type="button" className="mt-4" onClick={openCreate}>
            <Plus className="me-2 h-4 w-4" />
            {t("common.addProduct")}
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {products.fields.map((field, index) => {
            const product = watchedProducts?.[index];
            const title = getProductTitle(index);
            const imageUrl = isValidImageSrc(product?.image.defaultUrl)
              ? product.image.defaultUrl
              : null;
            const isVisible = product?.isVisible ?? true;

            return (
              <article
                key={field.fieldId}
                className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-dashboard-surface p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 shadow-dashboard"
              >
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted/30">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground" dir="ltr">
                        {product?.number ?? `${String(index + 1).padStart(2, "0")}/`}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                          isVisible
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {isVisible ? (
                          <Eye className="h-3 w-3" />
                        ) : (
                          <EyeOff className="h-3 w-3" />
                        )}
                        {isVisible ? t("about.productsUi.visible") : t("about.productsUi.hidden")}
                      </span>
                    </div>
                    <h3 className="truncate text-base font-semibold text-foreground">{title}</h3>
                    {product?.detailPage?.enabled ? (
                      <p className="text-xs text-muted-foreground" dir="ltr">
                        /projects/{product.detailPage.slug}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    disabled={index === 0}
                    onClick={() => products.swap(index, index - 1)}
                    aria-label={t("about.productsUi.moveUp")}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    disabled={index === products.fields.length - 1}
                    onClick={() => products.swap(index, index + 1)}
                    aria-label={t("about.productsUi.moveDown")}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => openEdit(index)}>
                    <Pencil className="me-2 h-4 w-4" />
                    {t("about.productsUi.edit")}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteIndex(index)}
                  >
                    <Trash2 className="me-2 h-4 w-4" />
                    {t("about.productsUi.delete")}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}


      <AlertDialog
        open={deleteIndex !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteIndex(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("about.productsUi.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("about.productsUi.deleteBody", {
                title: deleteIndex !== null ? getProductTitle(deleteIndex) : "",
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("about.productsUi.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              {t("about.productsUi.confirmDelete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function AboutProductFields({
  index,
  activeTab,
  onActiveTabChange,
}: {
  index: number;
  activeTab?: string;
  onActiveTabChange?: (value: string) => void;
}) {
  const t = useTranslations("cms");
  const form = useFormContext<CmsAboutPayload>();
  const [localTab, setLocalTab] = useState("basic");
  const tabValue = activeTab !== undefined ? activeTab : localTab;
  const handleTabChange = onActiveTabChange !== undefined ? onActiveTabChange : setLocalTab;

  const offers = useFieldArray({
    control: form.control,
    name: `products.${index}.offers`,
    keyName: "fieldId",
  });
  const audience = useFieldArray({
    control: form.control,
    name: `products.${index}.audience`,
    keyName: "fieldId",
  });

  const highlights = useFieldArray({
    control: form.control,
    name: `products.${index}.detailPage.highlights`,
    keyName: "fieldId",
  });
  const stats = useFieldArray({
    control: form.control,
    name: `products.${index}.detailPage.stats`,
    keyName: "fieldId",
  });
  const gallery = useFieldArray({
    control: form.control,
    name: `products.${index}.detailPage.gallery`,
    keyName: "fieldId",
  });
  const comparisons = useFieldArray({ control: form.control, name: `products.${index}.detailPage.comparisonRows`, keyName: "fieldId" });
  const testimonials = useFieldArray({ control: form.control, name: `products.${index}.detailPage.testimonials`, keyName: "fieldId" });
  const faqs = useFieldArray({ control: form.control, name: `products.${index}.detailPage.faqs`, keyName: "fieldId" });

  return (
    <Tabs value={tabValue} onValueChange={handleTabChange} className="w-full">
      <TabsList className="w-full justify-start border-b border-border bg-transparent p-0 h-10 gap-4 sm:gap-6 rounded-none mb-6 overflow-x-auto flex-nowrap scrollbar-none" variant="line">
        <TabsTrigger value="basic" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 pb-2 shadow-none font-semibold text-xs sm:text-sm">{t("about.detailPage.tabs.basic")}</TabsTrigger>
        <TabsTrigger value="stores" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 pb-2 shadow-none font-semibold text-xs sm:text-sm">{t("about.detailPage.tabs.stores")}</TabsTrigger>
        <TabsTrigger value="detail" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 pb-2 shadow-none font-semibold text-xs sm:text-sm">{t("about.detailPage.tabs.detail")}</TabsTrigger>
        <TabsTrigger value="features" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 pb-2 shadow-none font-semibold text-xs sm:text-sm">{t("about.detailPage.tabs.features")}</TabsTrigger>
        <TabsTrigger value="interactive" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 pb-2 shadow-none font-semibold text-xs sm:text-sm">{t("about.detailPage.tabs.interactive")}</TabsTrigger>
        <TabsTrigger value="seo" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 pb-2 shadow-none font-semibold text-xs sm:text-sm">{t("about.detailPage.tabs.seo")}</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="grid gap-6 outline-none">
        <CheckboxFormField<CmsAboutPayload>
          name={`products.${index}.isVisible`}
          label={t("common.visibleOnAbout")}
        />

        <div className="grid gap-5 md:grid-cols-2 md:gap-6">
          <FormField
            control={form.control}
            name={`products.${index}.number`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common.number")}</FormLabel>
                <FormControl>
                  <Input dir="ltr" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`products.${index}.imageSide`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common.imageSide")}</FormLabel>
                <FormControl>
                  <select
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                    value={field.value}
                    onChange={field.onChange}
                  >
                    <option value="left">{t("common.left")}</option>
                    <option value="right">{t("common.right")}</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <BilingualTextInput control={form.control} name={`products.${index}.title`} label={t("about.fields.title")} />
        <div className="grid gap-5 md:grid-cols-2">
          <FormField control={form.control} name={`products.${index}.category`} render={({ field }) => <FormItem><FormLabel>{t("about.fields.category")}</FormLabel><FormControl><select className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" value={field.value ?? "other"} onChange={field.onChange}><option value="marketplace">{t("about.categories.marketplace")}</option><option value="property">{t("about.categories.property")}</option><option value="fitness">{t("about.categories.fitness")}</option><option value="other">{t("about.categories.other")}</option></select></FormControl><FormMessage /></FormItem>} />
          <FormField
            control={form.control}
            name={`products.${index}.sortOrder`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("about.fields.sortOrder")}</FormLabel>
                <FormControl>
                  <Input type="number" value={field.value ?? 0} onChange={(event) => field.onChange(Number(event.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <BilingualTipTapField control={form.control} name={`products.${index}.body`} label={t("common.description")} />
        <LocalizedMediaPicker control={form.control} name={`products.${index}.image`} label={t("about.fields.productImage")} />
      </TabsContent>

      <TabsContent value="stores" className="grid gap-6 outline-none">
        <BilingualTextInput control={form.control} name={`products.${index}.offersLabel`} label={t("about.fields.offersLabel")} />
        <NestedLabelRepeater
          title={t("about.repeaters.offers")}
          itemLabel={t("about.repeaters.offersItem")}
          fields={offers.fields}
          onAdd={() =>
            offers.append({ id: `offer-${Date.now()}`, label: { ar: "", en: "" }, isVisible: true })
          }
          onRemove={offers.remove}
          onSwap={offers.swap}
          namePrefix={`products.${index}.offers`}
        />
        <BilingualTextInput control={form.control} name={`products.${index}.audienceLabel`} label={t("about.fields.audienceLabel")} />
        <NestedLabelRepeater
          title={t("about.repeaters.audience")}
          itemLabel={t("about.repeaters.audienceItem")}
          fields={audience.fields}
          onAdd={() =>
            audience.append({ id: `audience-${Date.now()}`, label: { ar: "", en: "" }, isVisible: true })
          }
          onRemove={audience.remove}
          onSwap={audience.swap}
          namePrefix={`products.${index}.audience`}
        />
        <BilingualTextInput control={form.control} name={`products.${index}.downloadTitle`} label={t("about.fields.downloadTitle")} />
        <StoreLinksEditor productIndex={index} />
      </TabsContent>

      <TabsContent value="detail" className="grid gap-6 outline-none">
        <CheckboxFormField<CmsAboutPayload>
          name={`products.${index}.detailPage.enabled`}
          label={t("about.detailPage.enable")}
        />
        <FormField
          control={form.control}
          name={`products.${index}.detailPage.slug`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("about.detailPage.slug")}</FormLabel>
              <FormControl>
                <SlugInput placeholder={t("about.detailPage.slugPlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <BilingualTextInput
          control={form.control}
          name={`products.${index}.detailPage.tagline`}
          label={t("about.detailPage.tagline")}
        />
        <BilingualTipTapField
          control={form.control}
          name={`products.${index}.detailPage.overview`}
          label={t("about.detailPage.overview")}
        />
        <FormField
          control={form.control}
          name={`products.${index}.detailPage.whatsappHref`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("about.detailPage.whatsapp")}</FormLabel>
              <FormControl>
                <Input dir="ltr" placeholder="https://wa.me/965..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-5 border-t border-border/60 pt-6 md:grid-cols-2">
          <BilingualTextInput
            control={form.control}
            name={`products.${index}.detailPage.detailCtaLabel`}
            label={t("about.detailPage.ctaLabel")}
          />
          <FormField
            control={form.control}
            name={`products.${index}.detailPage.detailCtaHref`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("about.detailPage.ctaHref")}</FormLabel>
                <FormControl>
                  <Input dir="ltr" placeholder={t("common.urlPlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <LocalizedMediaPicker control={form.control} name={`products.${index}.detailPage.mockupMedia`} label={t("about.detailPage.mockupMedia")} />
        <FormField control={form.control} name={`products.${index}.detailPage.mockupVideoUrl`} render={({ field }) => <FormItem><FormLabel>{t("about.detailPage.mockupVideoUrl")}</FormLabel><FormControl><Input dir="ltr" placeholder="https://.../demo.webm" {...field} /></FormControl><FormMessage /></FormItem>} />
        <CheckboxFormField<CmsAboutPayload> name={`products.${index}.detailPage.mockupVisible`} label={t("about.detailPage.showMockup")} />
        <div className="border-t border-border/60 pt-6 space-y-6">
          <CheckboxFormField<CmsAboutPayload> name={`products.${index}.detailPage.useCaseVisible`} label={t("about.detailPage.showUseCase")} />
          <BilingualTextInput control={form.control} name={`products.${index}.detailPage.useCaseStory`} label={t("about.detailPage.useCaseStory")} />
        </div>
      </TabsContent>

      <TabsContent value="features" className="grid gap-6 outline-none">

        <RepeaterBlock
          title={t("about.detailPage.highlights")}
          itemLabel={t("about.detailPage.highlightItem")}
          onAdd={() =>
            highlights.append({
              id: `highlight-${Date.now()}`,
              title: { ar: "", en: "" },
              body: { ar: "", en: "" },
              isVisible: true,
            })
          }
          fields={highlights.fields}
          onRemove={highlights.remove}
          onSwap={highlights.swap}
          renderItem={(itemIndex) => (
            <>
              <CheckboxFormField<CmsAboutPayload>
                name={`products.${index}.detailPage.highlights.${itemIndex}.isVisible`}
                label={t("common.visible")}
              />
              <BilingualTextInput
                control={form.control}
                name={`products.${index}.detailPage.highlights.${itemIndex}.title`}
                label={t("about.fields.title")}
              />
              <BilingualTextInput
                control={form.control}
                name={`products.${index}.detailPage.highlights.${itemIndex}.body`}
                label={t("common.description")}
              />
            </>
          )}
        />

        <RepeaterBlock
          title={t("about.detailPage.stats")}
          itemLabel={t("about.detailPage.statItem")}
          onAdd={() =>
            stats.append({
              id: `stat-${Date.now()}`,
              value: { ar: "", en: "" },
              label: { ar: "", en: "" },
              description: { ar: "", en: "" },
              isVisible: true,
            })
          }
          fields={stats.fields}
          onRemove={stats.remove}
          onSwap={stats.swap}
          renderItem={(itemIndex) => (
            <>
              <CheckboxFormField<CmsAboutPayload>
                name={`products.${index}.detailPage.stats.${itemIndex}.isVisible`}
                label={t("common.visible")}
              />
              <BilingualTextInput
                control={form.control}
                name={`products.${index}.detailPage.stats.${itemIndex}.value`}
                label={t("about.detailPage.statValue")}
              />
              <BilingualTextInput
                control={form.control}
                name={`products.${index}.detailPage.stats.${itemIndex}.label`}
                label={t("about.detailPage.statLabel")}
              />
              <BilingualTextInput
                control={form.control}
                name={`products.${index}.detailPage.stats.${itemIndex}.description`}
                label={t("about.detailPage.statDescription")}
              />
            </>
          )}
        />

        <RepeaterBlock
          title={t("about.detailPage.gallery")}
          itemLabel={t("about.detailPage.galleryItem")}
          onAdd={() =>
            gallery.append({
              id: `gallery-${Date.now()}`,
              image: {
                defaultAssetId: null,
                defaultUrl: "",
                alt: { ar: "", en: "" },
                isDecorative: true,
              },
              caption: { ar: "", en: "" },
              isVisible: true,
            })
          }
          fields={gallery.fields}
          onRemove={gallery.remove}
          onSwap={gallery.swap}
          renderItem={(itemIndex) => (
            <>
              <CheckboxFormField<CmsAboutPayload>
                name={`products.${index}.detailPage.gallery.${itemIndex}.isVisible`}
                label={t("common.visible")}
              />
              <LocalizedMediaPicker
                control={form.control}
                name={`products.${index}.detailPage.gallery.${itemIndex}.image`}
                label={t("about.detailPage.galleryImage")}
              />
              <BilingualTextInput
                control={form.control}
                name={`products.${index}.detailPage.gallery.${itemIndex}.caption`}
                label={t("about.detailPage.galleryCaption")}
              />
            </>
          )}
        />
      </TabsContent>

      <TabsContent value="interactive" className="grid gap-6 outline-none">
        <div className="grid gap-4 md:grid-cols-3">
          <CheckboxFormField<CmsAboutPayload> name={`products.${index}.detailPage.comparisonVisible`} label={t("about.detailPage.showComparison")} />
          <CheckboxFormField<CmsAboutPayload> name={`products.${index}.detailPage.testimonialsVisible`} label={t("about.detailPage.showTestimonials")} />
          <CheckboxFormField<CmsAboutPayload> name={`products.${index}.detailPage.faqsVisible`} label={t("about.detailPage.showFaqs")} />
        </div>

        <p className="rounded-xl border border-brand/20 bg-brand/5 px-4 py-3 text-sm leading-6 text-muted-foreground">
          {t("about.detailPage.comparisonHint")}
        </p>
        <RepeaterBlock title={t("about.detailPage.comparison")} itemLabel={t("about.detailPage.comparisonItem")} onAdd={() => comparisons.append({ id: `comparison-${Date.now()}`, traditional: { ar: "", en: "" }, withApp: { ar: "", en: "" }, isVisible: true })} fields={comparisons.fields} onRemove={comparisons.remove} onSwap={comparisons.swap} renderItem={(itemIndex) => <><CheckboxFormField<CmsAboutPayload> name={`products.${index}.detailPage.comparisonRows.${itemIndex}.isVisible`} label={t("common.visible")} /><BilingualTextInput control={form.control} name={`products.${index}.detailPage.comparisonRows.${itemIndex}.traditional`} label={t("about.detailPage.traditional")} /><BilingualTextInput control={form.control} name={`products.${index}.detailPage.comparisonRows.${itemIndex}.withApp`} label={t("about.detailPage.withApp")} /></>} />
        <p className="rounded-xl border border-brand/20 bg-brand/5 px-4 py-3 text-sm leading-6 text-muted-foreground">
          {t("about.detailPage.faqHint")}
        </p>
        <RepeaterBlock title={t("about.detailPage.testimonials")} itemLabel={t("about.detailPage.testimonialItem")} onAdd={() => testimonials.append({ id: `testimonial-${Date.now()}`, quote: { ar: "", en: "" }, name: { ar: "", en: "" }, role: { ar: "", en: "" }, avatar: { defaultAssetId: null, defaultUrl: "", alt: { ar: "", en: "" }, isDecorative: true }, isVisible: true })} fields={testimonials.fields} onRemove={testimonials.remove} onSwap={testimonials.swap} renderItem={(itemIndex) => <><CheckboxFormField<CmsAboutPayload> name={`products.${index}.detailPage.testimonials.${itemIndex}.isVisible`} label={t("common.visible")} /><BilingualTextInput control={form.control} name={`products.${index}.detailPage.testimonials.${itemIndex}.quote`} label={t("about.detailPage.quote")} /><BilingualTextInput control={form.control} name={`products.${index}.detailPage.testimonials.${itemIndex}.name`} label={t("about.detailPage.personName")} /><BilingualTextInput control={form.control} name={`products.${index}.detailPage.testimonials.${itemIndex}.role`} label={t("about.detailPage.personRole")} /><LocalizedMediaPicker control={form.control} name={`products.${index}.detailPage.testimonials.${itemIndex}.avatar`} label={t("about.detailPage.personAvatar")} aspect={1} /></>} />
        <RepeaterBlock title={t("about.detailPage.faqs")} itemLabel={t("about.detailPage.faqItem")} onAdd={() => faqs.append({ id: `faq-${Date.now()}`, question: { ar: "", en: "" }, answer: { ar: "", en: "" }, isVisible: true })} fields={faqs.fields} onRemove={faqs.remove} onSwap={faqs.swap} renderItem={(itemIndex) => <><CheckboxFormField<CmsAboutPayload> name={`products.${index}.detailPage.faqs.${itemIndex}.isVisible`} label={t("common.visible")} /><BilingualTextInput control={form.control} name={`products.${index}.detailPage.faqs.${itemIndex}.question`} label={t("about.detailPage.question")} /><BilingualTextInput control={form.control} name={`products.${index}.detailPage.faqs.${itemIndex}.answer`} label={t("about.detailPage.answer")} /></>} />
      </TabsContent>

      <TabsContent value="seo" className="grid gap-6 outline-none">
        <div className="rounded-xl border border-border/80 bg-muted/20 p-5 grid gap-5">
          <h5 className="font-semibold text-sm text-foreground">{t("about.fields.projectCard")}</h5>
          <CheckboxFormField<CmsAboutPayload> name={`products.${index}.featuredInProjects`} label={t("about.fields.featuredInProjects")} />
          <BilingualTextInput control={form.control} name={`products.${index}.projectCardDescription`} label={t("about.fields.projectCardDescription")} />
          <LocalizedMediaPicker control={form.control} name={`products.${index}.projectCardImage`} label={t("about.fields.projectCardImage")} />
        </div>

        <div className="rounded-xl border border-border/80 bg-muted/20 p-5 grid gap-5">
          <h5 className="font-semibold text-sm text-foreground">{t("about.detailPage.launchOffer")}</h5>
          <p className="rounded-lg border border-brand/15 bg-brand/5 px-3 py-2 text-sm leading-6 text-muted-foreground">{t("about.detailPage.launchOfferHint")}</p>
          <CheckboxFormField<CmsAboutPayload> name={`products.${index}.detailPage.launchOfferVisible`} label={t("about.detailPage.showLaunchOffer")} />
          <BilingualTextInput control={form.control} name={`products.${index}.detailPage.launchOffer`} label={t("about.detailPage.launchOffer")} />
          <BilingualTextInput control={form.control} name={`products.${index}.detailPage.launchOfferTerms`} label={t("about.detailPage.launchOfferTerms")} />
          <LaunchOfferDateFields index={index} />
          <div className="grid gap-5 md:grid-cols-2">
            <BilingualTextInput control={form.control} name={`products.${index}.detailPage.launchOfferCtaLabel`} label={t("about.detailPage.launchOfferCtaLabel")} />
            <FormField control={form.control} name={`products.${index}.detailPage.launchOfferCtaHref`} render={({ field }) => <FormItem><FormLabel>{t("about.detailPage.launchOfferCtaHref")}</FormLabel><FormControl><Input dir="ltr" {...field} /></FormControl><FormMessage /></FormItem>} />
          </div>
        </div>

        <div className="rounded-xl border border-border/80 bg-muted/20 p-5 grid gap-5">
          <h5 className="font-semibold text-sm text-foreground">{t("about.detailPage.seoTitle")}</h5>
          <BilingualTextInput
            control={form.control}
            name={`products.${index}.detailPage.seo.metaTitle`}
            label={t("about.fields.metaTitle")}
          />
          <BilingualTextInput
            control={form.control}
            name={`products.${index}.detailPage.seo.metaDescription`}
            label={t("about.fields.metaDescription")}
          />
          <BilingualTextInput
            control={form.control}
            name={`products.${index}.detailPage.seo.ogTitle`}
            label={t("about.fields.ogTitle")}
          />
          <BilingualTextInput
            control={form.control}
            name={`products.${index}.detailPage.seo.ogDescription`}
            label={t("about.fields.ogDescription")}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}

function NestedLabelRepeater({
  title,
  itemLabel,
  fields,
  onAdd,
  onRemove,
  onSwap,
  namePrefix,
}: {
  title: string;
  itemLabel: string;
  fields: Array<{ id: string; fieldId: string }>;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onSwap: (from: number, to: number) => void;
  namePrefix: `products.${number}.offers` | `products.${number}.audience`;
}) {
  const t = useTranslations("cms.common");
  const form = useFormContext<CmsAboutPayload>();

  return (
    <div className="grid gap-4 rounded-xl border border-dashed border-border/80 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h4 className="font-medium">{title}</h4>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <Plus className="me-2 h-4 w-4" />
          {t("add")}
        </Button>
      </div>
      {fields.map((field, itemIndex) => (
        <div key={field.fieldId} className="grid gap-4 rounded-xl bg-muted/30 p-4">
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" size="icon-sm" disabled={itemIndex === 0} onClick={() => onSwap(itemIndex, itemIndex - 1)}>
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button type="button" variant="outline" size="icon-sm" disabled={itemIndex === fields.length - 1} onClick={() => onSwap(itemIndex, itemIndex + 1)}>
              <ArrowDown className="h-4 w-4" />
            </Button>
            <Button type="button" variant="destructive" size="icon-sm" onClick={() => onRemove(itemIndex)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <CheckboxFormField<CmsAboutPayload>
            name={`${namePrefix}.${itemIndex}.isVisible`}
            label={t("visible")}
          />
          <BilingualTextInput control={form.control} name={`${namePrefix}.${itemIndex}.label`} label={itemLabel} />
        </div>
      ))}
    </div>
  );
}

function StoreLinksEditor({ productIndex }: { productIndex: number }) {
  const t = useTranslations("cms");
  const form = useFormContext<CmsAboutPayload>();
  const { fields, append } = useFieldArray({
    control: form.control,
    name: `products.${productIndex}.storeButtons`,
    keyName: "fieldId",
  });

  // Ensure Apple and Google entries always exist (in useEffect to avoid render-time side effects)
  const platforms = ["app-store", "google-play"] as const;
  useEffect(() => {
    platforms.forEach((platform) => {
      if (!fields.some((f) => (f as unknown as { platform: string }).platform === platform)) {
        append({
          id: platform,
          platform,
          preLabel: { ar: "", en: "" },
          label: platform === "app-store" ? { ar: "App Store", en: "App Store" } : { ar: "Google Play", en: "Google Play" },
          href: "",
          qrImage: { defaultAssetId: null, defaultUrl: "", alt: { ar: "", en: "" }, isDecorative: true },
          isVisible: true,
        });
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productIndex]);

  const PLATFORM_META = {
    "app-store": {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white" aria-hidden="true">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
        </svg>
      ),
      bg: "bg-[#1c1c1e]",
      label: "Apple App Store",
      placeholder: "https://apps.apple.com/app/id...",
    },
    "google-play": {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white" aria-hidden="true">
          <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199a1 1 0 010 1.732l-2.26 1.305L13.135 12l2.303-2.305 2.26 1.813zM5.864 3.658L16.8 9.99l-2.302 2.302-8.635-8.634z" />
        </svg>
      ),
      bg: "bg-[#01073d]",
      label: "Google Play",
      placeholder: "https://play.google.com/store/apps/details?id=...",
    },
  } as const;

  return (
    <div className="grid gap-4 rounded-xl border border-dashed border-border/80 p-4 sm:p-5">
      <h4 className="font-medium">{t("about.repeaters.storeButtons")}</h4>
      <div className="grid gap-3">
        {platforms.map((platform) => {
          const idx = fields.findIndex(
            (f) => (f as unknown as { platform: string }).platform === platform
          );
          if (idx === -1) return null;
          const meta = PLATFORM_META[platform];
          const namePrefix = `products.${productIndex}.storeButtons.${idx}` as const;
          return (
            <div key={platform} className="flex items-center gap-3 rounded-xl bg-muted/30 p-3">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.bg}`}>
                {meta.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="mb-1.5 text-xs font-semibold text-muted-foreground">{meta.label}</p>
                <FormField
                  control={form.control}
                  name={`${namePrefix}.href`}
                  render={({ field: hrefField }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          dir="ltr"
                          placeholder={meta.placeholder}
                          {...hrefField}
                          className="h-9 text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <CheckboxFormField<CmsAboutPayload>
                name={`${namePrefix}.isVisible`}
                label={t("common.visible")}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LaunchOfferDateFields({ index }: { index: number }) {
  const t = useTranslations("cms");
  const form = useFormContext<CmsAboutPayload>();
  const startValue = useWatch({
    control: form.control,
    name: `products.${index}.detailPage.launchOfferStartsAt`,
  });

  // Computed on the client only to avoid an SSR/client hydration mismatch on "today".
  const [minToday, setMinToday] = useState<string | undefined>(undefined);
  useEffect(() => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    setMinToday(`${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T00:00`);
  }, []);

  const endMin = startValue?.trim() ? startValue : minToday;

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <FormField
        control={form.control}
        name={`products.${index}.detailPage.launchOfferStartsAt`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("about.detailPage.launchOfferStartsAt")}</FormLabel>
            <FormControl>
              <Input type="datetime-local" min={minToday} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`products.${index}.detailPage.launchOfferEndsAt`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("about.detailPage.launchOfferEndsAt")}</FormLabel>
            <FormControl>
              <Input type="datetime-local" min={endMin} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function RepeaterBlock({
  title,
  itemLabel,
  fields,
  onAdd,
  onRemove,
  onSwap,
  renderItem,
}: {
  title: string;
  itemLabel: string;
  fields: Array<{ id: string; fieldId: string }>;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onSwap: (from: number, to: number) => void;
  renderItem: (index: number) => ReactNode;
}) {
  const t = useTranslations("cms.common");

  return (
    <div className="grid gap-4 rounded-xl border border-dashed border-border/80 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h4 className="font-medium">{title}</h4>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <Plus className="me-2 h-4 w-4" />
          {t("add")}
        </Button>
      </div>
      {fields.map((field, itemIndex) => (
        <div key={field.fieldId} className="grid gap-4 rounded-xl bg-muted/30 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-muted-foreground">
              {itemLabel} {itemIndex + 1}
            </p>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="icon-sm" disabled={itemIndex === 0} onClick={() => onSwap(itemIndex, itemIndex - 1)}>
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button type="button" variant="outline" size="icon-sm" disabled={itemIndex === fields.length - 1} onClick={() => onSwap(itemIndex, itemIndex + 1)}>
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button type="button" variant="destructive" size="icon-sm" onClick={() => onRemove(itemIndex)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {renderItem(itemIndex)}
        </div>
      ))}
    </div>
  );
}
