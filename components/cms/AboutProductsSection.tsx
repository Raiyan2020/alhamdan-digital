"use client";

import Image from "next/image";
import { isValidImageSrc } from "@/lib/media/image-url";
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import type { CmsAboutPayload } from "@/lib/cms/types";
import { createDefaultAboutProduct } from "@/lib/cms/about-product-defaults";
import { stabilizeAboutProduct } from "@/lib/cms/about-storage";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BilingualTextInput, BilingualTipTapField } from "./BilingualFields";
import { AboutProductDetailFields } from "./AboutProductDetailFields";
import { CheckboxFormField } from "./CheckboxFormField";
import { LocalizedMediaPicker } from "./LocalizedMediaPicker";

export function AboutProductsSection() {
  const t = useTranslations("cms");
  const locale = useLocale();
  const form = useFormContext<CmsAboutPayload>();
  const products = useFieldArray({
    control: form.control,
    name: "products",
  });

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const watchedProducts = useWatch({
    control: form.control,
    name: "products",
  });

  function flushProduct(index: number) {
    const current = form.getValues(`products.${index}`);
    const seed = form.formState.defaultValues?.products?.[index] as
      | CmsAboutPayload["products"][number]
      | undefined;
    form.setValue(`products.${index}`, stabilizeAboutProduct(current, index, seed), {
      shouldDirty: true,
    });
  }

  function openCreate() {
    const newIndex = products.fields.length;
    const newProduct = createDefaultAboutProduct(newIndex);
    products.append(newProduct);
    form.setValue(`products.${newIndex}`, newProduct, { shouldDirty: true });
    setIsCreating(true);
    setEditIndex(newIndex);
  }

  function openEdit(index: number) {
    setIsCreating(false);
    setEditIndex(index);
  }

  function closeEditor() {
    if (isCreating && editIndex !== null) {
      products.remove(editIndex);
    } else if (editIndex !== null) {
      flushProduct(editIndex);
    }
    setIsCreating(false);
    setEditIndex(null);
  }

  function confirmEditor() {
    if (editIndex !== null) {
      flushProduct(editIndex);
    }
    setIsCreating(false);
    setEditIndex(null);
  }

  function confirmDelete() {
    if (deleteIndex === null) return;
    products.remove(deleteIndex);
    if (editIndex === deleteIndex) {
      setEditIndex(null);
      setIsCreating(false);
    }
    setDeleteIndex(null);
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
                key={field.id}
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

      <Dialog
        open={editIndex !== null}
        onOpenChange={(open) => {
          if (!open) closeEditor();
        }}
      >
        <DialogContent className="flex max-h-[min(90vh,900px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
          <DialogHeader className="shrink-0 border-b border-border/60 px-6 py-5 pe-14 text-start">
            <DialogTitle>
              {isCreating
                ? t("about.productsUi.createTitle")
                : t("about.productsUi.editTitle", {
                    index: (editIndex ?? 0) + 1,
                  })}
            </DialogTitle>
            <DialogDescription>{t("about.productsUi.dialogHint")}</DialogDescription>
          </DialogHeader>

          {editIndex !== null ? (
            <div
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-6"
              data-lenis-prevent
            >
              <AboutProductFields index={editIndex} />
            </div>
          ) : null}

          <DialogFooter className="mx-0 mb-0 shrink-0 flex-col items-stretch gap-3 border-t border-border/60 bg-muted/20 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">{t("about.productsUi.saveReminder")}</p>
            <div className="flex flex-wrap justify-end gap-2">
              <Button type="button" variant="outline" onClick={closeEditor}>
                {t("about.productsUi.cancel")}
              </Button>
              <Button type="button" onClick={confirmEditor}>
                {t("about.productsUi.done")}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

function AboutProductFields({ index }: { index: number }) {
  const t = useTranslations("cms");
  const form = useFormContext<CmsAboutPayload>();
  const offers = useFieldArray({
    control: form.control,
    name: `products.${index}.offers`,
  });
  const audience = useFieldArray({
    control: form.control,
    name: `products.${index}.audience`,
  });
  const storeButtons = useFieldArray({
    control: form.control,
    name: `products.${index}.storeButtons`,
  });

  return (
    <div className="grid gap-6 sm:gap-7">
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
      <BilingualTipTapField control={form.control} name={`products.${index}.body`} label={t("common.description")} />
      <LocalizedMediaPicker control={form.control} name={`products.${index}.image`} label={t("about.fields.productImage")} />
      <BilingualTextInput control={form.control} name={`products.${index}.offersLabel`} label={t("about.fields.offersLabel")} />
      <NestedLabelRepeater
        title={t("about.repeaters.offers")}
        itemLabel={t("about.repeaters.offersItem")}
        fields={offers.fields}
        onAdd={() =>
          offers.append({ id: `offer-${Date.now()}`, label: { ar: "عنصر جديد", en: "New item" }, isVisible: true })
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
          audience.append({ id: `audience-${Date.now()}`, label: { ar: "عنصر جديد", en: "New item" }, isVisible: true })
        }
        onRemove={audience.remove}
        onSwap={audience.swap}
        namePrefix={`products.${index}.audience`}
      />
      <BilingualTextInput control={form.control} name={`products.${index}.downloadTitle`} label={t("about.fields.downloadTitle")} />
      <StoreButtonRepeater
        fields={storeButtons.fields}
        onAdd={() =>
          storeButtons.append({
            id: `store-${Date.now()}`,
            preLabel: { ar: "احصل عليه على", en: "Get it on" },
            label: { ar: "Store", en: "Store" },
            href: "#",
            isVisible: true,
          })
        }
        onRemove={storeButtons.remove}
        onSwap={storeButtons.swap}
        namePrefix={`products.${index}.storeButtons`}
      />

      <AboutProductDetailFields index={index} />
    </div>
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
  fields: Array<{ id: string }>;
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
        <div key={field.id} className="grid gap-4 rounded-xl bg-muted/30 p-4">
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

function StoreButtonRepeater({
  fields,
  onAdd,
  onRemove,
  onSwap,
  namePrefix,
}: {
  fields: Array<{ id: string }>;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onSwap: (from: number, to: number) => void;
  namePrefix: `products.${number}.storeButtons`;
}) {
  const t = useTranslations("cms");
  const form = useFormContext<CmsAboutPayload>();

  return (
    <div className="grid gap-4 rounded-xl border border-dashed border-border/80 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h4 className="font-medium">{t("about.repeaters.storeButtons")}</h4>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <Plus className="me-2 h-4 w-4" />
          {t("common.addStore")}
        </Button>
      </div>
      {fields.map((field, itemIndex) => (
        <div key={field.id} className="grid gap-4 rounded-xl bg-muted/30 p-4">
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
            label={t("common.visible")}
          />
          <BilingualTextInput control={form.control} name={`${namePrefix}.${itemIndex}.preLabel`} label={t("about.fields.preLabel")} />
          <BilingualTextInput control={form.control} name={`${namePrefix}.${itemIndex}.label`} label={t("about.fields.storeLabel")} />
          <FormField
            control={form.control}
            name={`${namePrefix}.${itemIndex}.href`}
            render={({ field: hrefField }) => (
              <FormItem>
                <FormLabel>{t("about.fields.storeUrl")}</FormLabel>
                <FormControl>
                  <Input dir="ltr" {...hrefField} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}
    </div>
  );
}
