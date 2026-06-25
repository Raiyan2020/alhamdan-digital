"use client";

import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import type { CmsAboutPayload } from "@/lib/cms/types";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SlugInput } from "@/components/ui/slug-input";
import { BilingualTextInput, BilingualTipTapField } from "./BilingualFields";
import { CheckboxFormField } from "./CheckboxFormField";
import { LocalizedMediaPicker } from "./LocalizedMediaPicker";

type AboutProductDetailFieldsProps = {
  index: number;
};

export function AboutProductDetailFields({ index }: AboutProductDetailFieldsProps) {
  const t = useTranslations("cms");
  const form = useFormContext<CmsAboutPayload>();
  const highlights = useFieldArray({
    control: form.control,
    name: `products.${index}.detailPage.highlights`,
  });
  const stats = useFieldArray({
    control: form.control,
    name: `products.${index}.detailPage.stats`,
  });
  const gallery = useFieldArray({
    control: form.control,
    name: `products.${index}.detailPage.gallery`,
  });

  return (
    <div className="grid gap-6 rounded-2xl border border-dashboard-gulf/20 bg-dashboard-gulf-light/20 p-5 sm:gap-7 sm:p-6">
      <div>
        <h4 className="text-base font-semibold text-dashboard-ink">{t("about.detailPage.title")}</h4>
        <p className="mt-1 text-sm text-dashboard-ink-muted">{t("about.detailPage.body")}</p>
      </div>

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

      <RepeaterBlock
        title={t("about.detailPage.highlights")}
        itemLabel={t("about.detailPage.highlightItem")}
        onAdd={() =>
          highlights.append({
            id: `highlight-${Date.now()}`,
            title: { ar: "نقطة جديدة", en: "New highlight" },
            body: { ar: "وصف مختصر.", en: "Short description." },
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
            value: { ar: "100+", en: "100+" },
            label: { ar: "مستخدم", en: "Users" },
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

      <div className="grid gap-5 border-t border-border/60 pt-6">
        <h5 className="font-medium">{t("about.detailPage.seoTitle")}</h5>
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
  fields: Array<{ id: string }>;
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
        <div key={field.id} className="grid gap-4 rounded-xl bg-muted/30 p-4">
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
