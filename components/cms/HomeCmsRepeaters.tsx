"use client";

import { Copy, Plus, Trash2, ArrowDown, ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  useFieldArray,
  useFormContext,
  type Path,
} from "react-hook-form";
import type {
  BilingualText,
  CmsHomePayload,
  CmsRichText,
  LocalizedMediaField,
} from "@/lib/cms/types";
import { aboutCardIconMap, sectorIconMap } from "@/components/home/sector-icons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BilingualTextInput, BilingualTipTapField } from "./BilingualFields";
import { LocalizedMediaPicker } from "./LocalizedMediaPicker";

const aboutCardKeyOptions = ["ai", "scale", "expertise", "mindset"] as const;
const visionIconOptions = ["eye", "send"] as const;
const productKeyOptions = ["diddeed", "bohamdan", "nafas", "road80"] as const;
const layoutOptions = ["text-start", "text-end"] as const;
const contactTypeOptions = ["phone", "email", "address"] as const;
const socialNetworkOptions = ["youtube", "linkedin", "instagram", "facebook"] as const;

const emptyRich = (): CmsRichText => ({
  json: { ar: "", en: "" },
  html: { ar: "<p></p>", en: "<p></p>" },
});

const defaultMedia = (
  url = "/figma/hero-visual.webp",
  alt: BilingualText = { ar: "صورة", en: "Image" },
): LocalizedMediaField => ({
  defaultAssetId: null,
  defaultUrl: url,
  alt,
  isDecorative: false,
});

function RepeaterToolbar({
  title,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onRemove,
  onDuplicate,
}: {
  title: string;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onDuplicate?: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h4 className="font-medium">{title}</h4>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onMoveUp} disabled={isFirst}>
          <ArrowUp className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onMoveDown} disabled={isLast}>
          <ArrowDown className="h-4 w-4" />
        </Button>
        {onDuplicate ? (
          <Button type="button" variant="outline" size="sm" onClick={onDuplicate}>
            <Copy className="h-4 w-4" />
          </Button>
        ) : null}
        <Button type="button" variant="destructive" size="sm" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function VisibilityField({ name }: { name: Path<CmsHomePayload> }) {
  const form = useFormContext<CmsHomePayload>();
  const t = useTranslations("cms.common");

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-center gap-2">
          <FormControl>
            <Checkbox checked={Boolean(field.value)} onCheckedChange={field.onChange} />
          </FormControl>
          <FormLabel className="m-0">{t("visibleOnSite")}</FormLabel>
        </FormItem>
      )}
    />
  );
}

function RepeaterShell({
  title,
  onAdd,
  children,
}: {
  title: string;
  onAdd: () => void;
  children: React.ReactNode;
}) {
  const t = useTranslations("cms.common");

  return (
    <div className="grid gap-4 rounded-xl border border-dashed border-border/80 p-4 sm:gap-5 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h4 className="font-medium">{title}</h4>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <Plus className="me-2 h-4 w-4" />
          {t("add")}
        </Button>
      </div>
      {children}
    </div>
  );
}

function cloneWithNewId<T extends { id: string }>(item: T): T {
  const clone =
    typeof structuredClone === "function"
      ? structuredClone(item)
      : (JSON.parse(JSON.stringify(item)) as T);
  return { ...clone, id: `${item.id}-copy-${Date.now()}` };
}

function optionTranslationKey(prefix: string, value: string) {
  return `common.${prefix}.${value}` as const;
}

export function NavRepeater() {
  const form = useFormContext<CmsHomePayload>();
  const t = useTranslations("cms");
  const fieldArray = useFieldArray({ control: form.control, name: "nav" });

  return (
    <RepeaterShell
      title={t("home.repeaters.navLinks")}
      onAdd={() =>
        fieldArray.append({
          label: { ar: "رابط جديد", en: "New link" },
          href: "#",
          isVisible: true,
        })
      }
    >
      {fieldArray.fields.map((field, index) => (
        <div key={field.id} className="grid gap-4 rounded-xl bg-muted/30 p-4">
          <RepeaterToolbar
            title={t("home.repeaters.navItem", { index: index + 1 })}
            isFirst={index === 0}
            isLast={index === fieldArray.fields.length - 1}
            onMoveUp={() => fieldArray.swap(index, index - 1)}
            onMoveDown={() => fieldArray.swap(index, index + 1)}
            onRemove={() => fieldArray.remove(index)}
            onDuplicate={() => {
              const source = form.getValues(`nav.${index}`);
              fieldArray.append({ ...source });
            }}
          />
          <VisibilityField name={`nav.${index}.isVisible`} />
          <BilingualTextInput control={form.control} name={`nav.${index}.label`} label={t("common.label")} />
          <FormField
            control={form.control}
            name={`nav.${index}.href`}
            render={({ field: hrefField }) => (
              <FormItem>
                <FormLabel>{t("common.url")}</FormLabel>
                <FormControl>
                  <Input dir="ltr" {...hrefField} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}
    </RepeaterShell>
  );
}

export function FooterLinksRepeater() {
  const form = useFormContext<CmsHomePayload>();
  const t = useTranslations("cms");
  const fieldArray = useFieldArray({ control: form.control, name: "footerLinks" });

  return (
    <RepeaterShell
      title={t("home.repeaters.footerLinks")}
      onAdd={() =>
        fieldArray.append({
          label: { ar: "رابط جديد", en: "New link" },
          href: "#",
          isVisible: true,
        })
      }
    >
      {fieldArray.fields.map((field, index) => (
        <div key={field.id} className="grid gap-4 rounded-xl bg-muted/30 p-4">
          <RepeaterToolbar
            title={t("common.item", { index: index + 1 })}
            isFirst={index === 0}
            isLast={index === fieldArray.fields.length - 1}
            onMoveUp={() => fieldArray.swap(index, index - 1)}
            onMoveDown={() => fieldArray.swap(index, index + 1)}
            onRemove={() => fieldArray.remove(index)}
            onDuplicate={() => {
              const source = form.getValues(`footerLinks.${index}`);
              fieldArray.append({ ...source });
            }}
          />
          <VisibilityField name={`footerLinks.${index}.isVisible`} />
          <BilingualTextInput control={form.control} name={`footerLinks.${index}.label`} label={t("common.label")} />
          <FormField
            control={form.control}
            name={`footerLinks.${index}.href`}
            render={({ field: hrefField }) => (
              <FormItem>
                <FormLabel>{t("common.url")}</FormLabel>
                <FormControl>
                  <Input dir="ltr" {...hrefField} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}
    </RepeaterShell>
  );
}

export function CyclePhrasesRepeater() {
  const form = useFormContext<CmsHomePayload>();
  const t = useTranslations("cms");
  const fieldArray = useFieldArray({ control: form.control, name: "hero.cyclePhrases" });

  return (
    <RepeaterShell
      title={t("home.repeaters.heroPhrases")}
      onAdd={() =>
        fieldArray.append({
          id: `phrase-${Date.now()}`,
          phrase: { ar: "عبارة جديدة", en: "New phrase" },
          isVisible: true,
        })
      }
    >
      {fieldArray.fields.map((field, index) => (
        <div key={field.id} className="grid gap-4 rounded-xl bg-muted/30 p-4">
          <RepeaterToolbar
            title={t("common.item", { index: index + 1 })}
            isFirst={index === 0}
            isLast={index === fieldArray.fields.length - 1}
            onMoveUp={() => fieldArray.swap(index, index - 1)}
            onMoveDown={() => fieldArray.swap(index, index + 1)}
            onRemove={() => fieldArray.remove(index)}
            onDuplicate={() => fieldArray.append(cloneWithNewId(form.getValues(`hero.cyclePhrases.${index}`)))}
          />
          <VisibilityField name={`hero.cyclePhrases.${index}.isVisible`} />
          <BilingualTextInput control={form.control} name={`hero.cyclePhrases.${index}.phrase`} label={t("home.repeaters.phrase")} />
        </div>
      ))}
    </RepeaterShell>
  );
}

export function AboutCardsRepeater() {
  const form = useFormContext<CmsHomePayload>();
  const t = useTranslations("cms");
  const fieldArray = useFieldArray({ control: form.control, name: "aboutCards" });

  return (
    <RepeaterShell
      title={t("home.repeaters.aboutCards")}
      onAdd={() =>
        fieldArray.append({
          id: `card-${Date.now()}`,
          key: "ai",
          title: { ar: "بطاقة جديدة", en: "New card" },
          body: emptyRich(),
          icon: "brain",
          isVisible: true,
        })
      }
    >
      {fieldArray.fields.map((field, index) => (
        <div key={field.id} className="grid gap-4 rounded-xl bg-muted/30 p-4">
          <RepeaterToolbar
            title={t("common.item", { index: index + 1 })}
            isFirst={index === 0}
            isLast={index === fieldArray.fields.length - 1}
            onMoveUp={() => fieldArray.swap(index, index - 1)}
            onMoveDown={() => fieldArray.swap(index, index + 1)}
            onRemove={() => fieldArray.remove(index)}
            onDuplicate={() => fieldArray.append(cloneWithNewId(form.getValues(`aboutCards.${index}`)))}
          />
          <VisibilityField name={`aboutCards.${index}.isVisible`} />
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name={`aboutCards.${index}.key`}
              render={({ field: keyField }) => (
                <FormItem>
                  <FormLabel>{t("common.cardKey")}</FormLabel>
                  <FormControl>
                    <select
                      className="h-8 w-full rounded-lg border border-input bg-background px-2 text-sm"
                      value={keyField.value}
                      onChange={keyField.onChange}
                    >
                      {aboutCardKeyOptions.map((key) => (
                        <option key={key} value={key}>
                          {t(optionTranslationKey("cardKeys", key))}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`aboutCards.${index}.icon`}
              render={({ field: iconField }) => (
                <FormItem>
                  <FormLabel>{t("common.icon")}</FormLabel>
                  <FormControl>
                    <select
                      className="h-8 w-full rounded-lg border border-input bg-background px-2 text-sm"
                      value={iconField.value}
                      onChange={iconField.onChange}
                    >
                      {Object.keys(aboutCardIconMap).map((key) => (
                        <option key={key} value={key}>
                          {t(optionTranslationKey("icons", key))}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <BilingualTextInput control={form.control} name={`aboutCards.${index}.title`} label={t("common.heading")} />
          <BilingualTipTapField control={form.control} name={`aboutCards.${index}.body`} label={t("common.description")} />
        </div>
      ))}
    </RepeaterShell>
  );
}

export function VisionMissionRepeater() {
  const form = useFormContext<CmsHomePayload>();
  const t = useTranslations("cms");
  const fieldArray = useFieldArray({ control: form.control, name: "visionMission" });

  return (
    <RepeaterShell
      title={t("home.repeaters.visionMission")}
      onAdd={() =>
        fieldArray.append({
          id: `vm-${Date.now()}`,
          title: { ar: "عنوان جديد", en: "New title" },
          body: emptyRich(),
          icon: "eye",
          isVisible: true,
        })
      }
    >
      {fieldArray.fields.map((field, index) => (
        <div key={field.id} className="grid gap-4 rounded-xl bg-muted/30 p-4">
          <RepeaterToolbar
            title={t("common.item", { index: index + 1 })}
            isFirst={index === 0}
            isLast={index === fieldArray.fields.length - 1}
            onMoveUp={() => fieldArray.swap(index, index - 1)}
            onMoveDown={() => fieldArray.swap(index, index + 1)}
            onRemove={() => fieldArray.remove(index)}
            onDuplicate={() => fieldArray.append(cloneWithNewId(form.getValues(`visionMission.${index}`)))}
          />
          <VisibilityField name={`visionMission.${index}.isVisible`} />
          <FormField
            control={form.control}
            name={`visionMission.${index}.icon`}
            render={({ field: iconField }) => (
              <FormItem>
                <FormLabel>{t("common.icon")}</FormLabel>
                <FormControl>
                  <select
                    className="h-8 w-full rounded-lg border border-input bg-background px-2 text-sm"
                    value={iconField.value}
                    onChange={iconField.onChange}
                  >
                    {visionIconOptions.map((key) => (
                      <option key={key} value={key}>
                        {t(optionTranslationKey("icons", key))}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <BilingualTextInput control={form.control} name={`visionMission.${index}.title`} label={t("common.heading")} />
          <BilingualTipTapField control={form.control} name={`visionMission.${index}.body`} label={t("common.description")} />
        </div>
      ))}
    </RepeaterShell>
  );
}

export function ProcessStepsRepeater() {
  const form = useFormContext<CmsHomePayload>();
  const t = useTranslations("cms");
  const fieldArray = useFieldArray({ control: form.control, name: "process.steps" });

  return (
    <RepeaterShell
      title={t("home.repeaters.processSteps")}
      onAdd={() =>
        fieldArray.append({
          id: `step-${Date.now()}`,
          number: `${String(fieldArray.fields.length + 1).padStart(2, "0")}`,
          title: { ar: "خطوة جديدة", en: "New step" },
          body: emptyRich(),
          isVisible: true,
        })
      }
    >
      {fieldArray.fields.map((field, index) => (
        <div key={field.id} className="grid gap-4 rounded-xl bg-muted/30 p-4">
          <RepeaterToolbar
            title={t("common.item", { index: index + 1 })}
            isFirst={index === 0}
            isLast={index === fieldArray.fields.length - 1}
            onMoveUp={() => fieldArray.swap(index, index - 1)}
            onMoveDown={() => fieldArray.swap(index, index + 1)}
            onRemove={() => fieldArray.remove(index)}
            onDuplicate={() => fieldArray.append(cloneWithNewId(form.getValues(`process.steps.${index}`)))}
          />
          <VisibilityField name={`process.steps.${index}.isVisible`} />
          <FormField
            control={form.control}
            name={`process.steps.${index}.number`}
            render={({ field: numberField }) => (
              <FormItem>
                <FormLabel>{t("common.stepNumber")}</FormLabel>
                <FormControl>
                  <Input dir="ltr" {...numberField} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <BilingualTextInput control={form.control} name={`process.steps.${index}.title`} label={t("common.heading")} />
          <BilingualTipTapField control={form.control} name={`process.steps.${index}.body`} label={t("common.description")} />
        </div>
      ))}
    </RepeaterShell>
  );
}

export function ProductItemsRepeater() {
  const form = useFormContext<CmsHomePayload>();
  const t = useTranslations("cms");
  const fieldArray = useFieldArray({ control: form.control, name: "products.items" });

  return (
    <RepeaterShell
      title={t("home.repeaters.productItems")}
      onAdd={() =>
        fieldArray.append({
          id: `product-${Date.now()}`,
          key: "diddeed",
          title: { ar: "منتج جديد", en: "New product" },
          body: emptyRich(),
          image: defaultMedia(),
          layout: "text-start",
          isVisible: true,
        })
      }
    >
      {fieldArray.fields.map((field, index) => (
        <div key={field.id} className="grid gap-4 rounded-xl bg-muted/30 p-4">
          <RepeaterToolbar
            title={t("about.repeaters.product", { index: index + 1 })}
            isFirst={index === 0}
            isLast={index === fieldArray.fields.length - 1}
            onMoveUp={() => fieldArray.swap(index, index - 1)}
            onMoveDown={() => fieldArray.swap(index, index + 1)}
            onRemove={() => fieldArray.remove(index)}
            onDuplicate={() => fieldArray.append(cloneWithNewId(form.getValues(`products.items.${index}`)))}
          />
          <VisibilityField name={`products.items.${index}.isVisible`} />
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name={`products.items.${index}.key`}
              render={({ field: keyField }) => (
                <FormItem>
                  <FormLabel>{t("common.productKey")}</FormLabel>
                  <FormControl>
                    <select
                      className="h-8 w-full rounded-lg border border-input bg-background px-2 text-sm"
                      value={keyField.value}
                      onChange={keyField.onChange}
                    >
                      {productKeyOptions.map((key) => (
                        <option key={key} value={key}>
                          {t(optionTranslationKey("productKeys", key))}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`products.items.${index}.layout`}
              render={({ field: layoutField }) => (
                <FormItem>
                  <FormLabel>{t("common.layout")}</FormLabel>
                  <FormControl>
                    <select
                      className="h-8 w-full rounded-lg border border-input bg-background px-2 text-sm"
                      value={layoutField.value}
                      onChange={layoutField.onChange}
                    >
                      {layoutOptions.map((key) => (
                        <option key={key} value={key}>
                          {t(optionTranslationKey("layouts", key))}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <BilingualTextInput control={form.control} name={`products.items.${index}.title`} label={t("common.heading")} />
          <BilingualTipTapField control={form.control} name={`products.items.${index}.body`} label={t("common.description")} />
          <LocalizedMediaPicker control={form.control} name={`products.items.${index}.image`} label={t("common.productImage")} />
        </div>
      ))}
    </RepeaterShell>
  );
}

export function ServiceItemsRepeater() {
  const form = useFormContext<CmsHomePayload>();
  const t = useTranslations("cms");
  const fieldArray = useFieldArray({ control: form.control, name: "services.items" });

  return (
    <RepeaterShell
      title={t("home.repeaters.serviceItems")}
      onAdd={() =>
        fieldArray.append({
          id: `service-${Date.now()}`,
          title: { ar: "خدمة جديدة", en: "New service" },
          body: emptyRich(),
          phoneImage: defaultMedia("/figma/services-phone.webp"),
          visualImage: defaultMedia("/figma/services-visual.webp"),
          isVisible: true,
        })
      }
    >
      {fieldArray.fields.map((field, index) => (
        <div key={field.id} className="grid gap-4 rounded-xl bg-muted/30 p-4">
          <RepeaterToolbar
            title={t("common.item", { index: index + 1 })}
            isFirst={index === 0}
            isLast={index === fieldArray.fields.length - 1}
            onMoveUp={() => fieldArray.swap(index, index - 1)}
            onMoveDown={() => fieldArray.swap(index, index + 1)}
            onRemove={() => fieldArray.remove(index)}
            onDuplicate={() => fieldArray.append(cloneWithNewId(form.getValues(`services.items.${index}`)))}
          />
          <VisibilityField name={`services.items.${index}.isVisible`} />
          <BilingualTextInput control={form.control} name={`services.items.${index}.title`} label={t("common.heading")} />
          <BilingualTipTapField control={form.control} name={`services.items.${index}.body`} label={t("common.description")} />
          <LocalizedMediaPicker control={form.control} name={`services.items.${index}.phoneImage`} label={t("common.phoneImage")} />
          <LocalizedMediaPicker control={form.control} name={`services.items.${index}.visualImage`} label={t("common.visualImage")} />
        </div>
      ))}
    </RepeaterShell>
  );
}

export function SectorItemsRepeater() {
  const form = useFormContext<CmsHomePayload>();
  const t = useTranslations("cms");
  const fieldArray = useFieldArray({ control: form.control, name: "sectors.items" });

  return (
    <RepeaterShell
      title={t("home.repeaters.sectorItems")}
      onAdd={() =>
        fieldArray.append({
          id: `sector-${Date.now()}`,
          title: { ar: "قطاع جديد", en: "New sector" },
          icon: "building2",
          isVisible: true,
        })
      }
    >
      {fieldArray.fields.map((field, index) => (
        <div key={field.id} className="grid gap-4 rounded-xl bg-muted/30 p-4">
          <RepeaterToolbar
            title={t("common.item", { index: index + 1 })}
            isFirst={index === 0}
            isLast={index === fieldArray.fields.length - 1}
            onMoveUp={() => fieldArray.swap(index, index - 1)}
            onMoveDown={() => fieldArray.swap(index, index + 1)}
            onRemove={() => fieldArray.remove(index)}
            onDuplicate={() => fieldArray.append(cloneWithNewId(form.getValues(`sectors.items.${index}`)))}
          />
          <VisibilityField name={`sectors.items.${index}.isVisible`} />
          <FormField
            control={form.control}
            name={`sectors.items.${index}.icon`}
            render={({ field: iconField }) => (
              <FormItem>
                <FormLabel>{t("common.icon")}</FormLabel>
                <FormControl>
                  <select
                    className="h-8 w-full rounded-lg border border-input bg-background px-2 text-sm"
                    value={iconField.value}
                    onChange={iconField.onChange}
                  >
                    {Object.keys(sectorIconMap).map((key) => (
                      <option key={key} value={key}>
                        {t(optionTranslationKey("icons", key))}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <BilingualTextInput control={form.control} name={`sectors.items.${index}.title`} label={t("common.heading")} />
        </div>
      ))}
    </RepeaterShell>
  );
}

export function WhyReasonsRepeater() {
  const form = useFormContext<CmsHomePayload>();
  const t = useTranslations("cms");
  const fieldArray = useFieldArray({ control: form.control, name: "why.reasons" });

  return (
    <RepeaterShell
      title={t("home.repeaters.whyReasons")}
      onAdd={() =>
        fieldArray.append({
          id: `reason-${Date.now()}`,
          text: { ar: "سبب جديد", en: "New reason" },
          isVisible: true,
        })
      }
    >
      {fieldArray.fields.map((field, index) => (
        <div key={field.id} className="grid gap-4 rounded-xl bg-muted/30 p-4">
          <RepeaterToolbar
            title={t("common.item", { index: index + 1 })}
            isFirst={index === 0}
            isLast={index === fieldArray.fields.length - 1}
            onMoveUp={() => fieldArray.swap(index, index - 1)}
            onMoveDown={() => fieldArray.swap(index, index + 1)}
            onRemove={() => fieldArray.remove(index)}
            onDuplicate={() => fieldArray.append(cloneWithNewId(form.getValues(`why.reasons.${index}`)))}
          />
          <VisibilityField name={`why.reasons.${index}.isVisible`} />
          <BilingualTextInput control={form.control} name={`why.reasons.${index}.text`} label={t("common.reason")} />
        </div>
      ))}
    </RepeaterShell>
  );
}

export function MarketOutcomesRepeater() {
  const form = useFormContext<CmsHomePayload>();
  const t = useTranslations("cms");
  const fieldArray = useFieldArray({ control: form.control, name: "market.outcomes" });

  return (
    <RepeaterShell
      title={t("home.repeaters.marketOutcomes")}
      onAdd={() =>
        fieldArray.append({
          id: `outcome-${Date.now()}`,
          label: { ar: "نتيجة جديدة", en: "New outcome" },
          isVisible: true,
        })
      }
    >
      {fieldArray.fields.map((field, index) => (
        <div key={field.id} className="grid gap-4 rounded-xl bg-muted/30 p-4">
          <RepeaterToolbar
            title={t("common.item", { index: index + 1 })}
            isFirst={index === 0}
            isLast={index === fieldArray.fields.length - 1}
            onMoveUp={() => fieldArray.swap(index, index - 1)}
            onMoveDown={() => fieldArray.swap(index, index + 1)}
            onRemove={() => fieldArray.remove(index)}
            onDuplicate={() => fieldArray.append(cloneWithNewId(form.getValues(`market.outcomes.${index}`)))}
          />
          <VisibilityField name={`market.outcomes.${index}.isVisible`} />
          <BilingualTextInput control={form.control} name={`market.outcomes.${index}.label`} label={t("common.outcome")} />
        </div>
      ))}
    </RepeaterShell>
  );
}

export function ContactMethodsRepeater() {
  const form = useFormContext<CmsHomePayload>();
  const t = useTranslations("cms");
  const fieldArray = useFieldArray({ control: form.control, name: "footer.contactMethods" });

  return (
    <RepeaterShell
      title={t("home.repeaters.contactMethods")}
      onAdd={() =>
        fieldArray.append({
          id: `contact-${Date.now()}`,
          type: "phone",
          label: { ar: "هاتف", en: "Phone" },
          value: "",
          displayValue: { ar: "", en: "" },
          href: "#",
          isVisible: true,
        })
      }
    >
      {fieldArray.fields.map((field, index) => (
        <div key={field.id} className="grid gap-4 rounded-xl bg-muted/30 p-4">
          <RepeaterToolbar
            title={t("common.item", { index: index + 1 })}
            isFirst={index === 0}
            isLast={index === fieldArray.fields.length - 1}
            onMoveUp={() => fieldArray.swap(index, index - 1)}
            onMoveDown={() => fieldArray.swap(index, index + 1)}
            onRemove={() => fieldArray.remove(index)}
            onDuplicate={() => fieldArray.append(cloneWithNewId(form.getValues(`footer.contactMethods.${index}`)))}
          />
          <VisibilityField name={`footer.contactMethods.${index}.isVisible`} />
          <FormField
            control={form.control}
            name={`footer.contactMethods.${index}.type`}
            render={({ field: typeField }) => (
              <FormItem>
                <FormLabel>{t("common.type")}</FormLabel>
                <FormControl>
                  <select
                    className="h-8 w-full rounded-lg border border-input bg-background px-2 text-sm"
                    value={typeField.value}
                    onChange={typeField.onChange}
                  >
                    {contactTypeOptions.map((key) => (
                      <option key={key} value={key}>
                        {t(optionTranslationKey("contactTypes", key))}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <BilingualTextInput control={form.control} name={`footer.contactMethods.${index}.label`} label={t("common.label")} />
          <FormField
            control={form.control}
            name={`footer.contactMethods.${index}.value`}
            render={({ field: valueField }) => (
              <FormItem>
                <FormLabel>{t("common.value")}</FormLabel>
                <FormControl>
                  <Input dir="ltr" {...valueField} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <BilingualTextInput control={form.control} name={`footer.contactMethods.${index}.displayValue`} label={t("common.displayValue")} />
          <FormField
            control={form.control}
            name={`footer.contactMethods.${index}.href`}
            render={({ field: hrefField }) => (
              <FormItem>
                <FormLabel>{t("common.linkUrl")}</FormLabel>
                <FormControl>
                  <Input dir="ltr" {...hrefField} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}
    </RepeaterShell>
  );
}

export function SocialLinksRepeater() {
  const form = useFormContext<CmsHomePayload>();
  const t = useTranslations("cms");
  const fieldArray = useFieldArray({ control: form.control, name: "footer.socialLinks" });

  return (
    <RepeaterShell
      title={t("home.repeaters.socialLinks")}
      onAdd={() =>
        fieldArray.append({
          id: `social-${Date.now()}`,
          network: "youtube",
          label: { ar: "يوتيوب", en: "YouTube" },
          href: "#",
          isVisible: true,
        })
      }
    >
      {fieldArray.fields.map((field, index) => (
        <div key={field.id} className="grid gap-4 rounded-xl bg-muted/30 p-4">
          <RepeaterToolbar
            title={t("common.item", { index: index + 1 })}
            isFirst={index === 0}
            isLast={index === fieldArray.fields.length - 1}
            onMoveUp={() => fieldArray.swap(index, index - 1)}
            onMoveDown={() => fieldArray.swap(index, index + 1)}
            onRemove={() => fieldArray.remove(index)}
            onDuplicate={() => fieldArray.append(cloneWithNewId(form.getValues(`footer.socialLinks.${index}`)))}
          />
          <VisibilityField name={`footer.socialLinks.${index}.isVisible`} />
          <FormField
            control={form.control}
            name={`footer.socialLinks.${index}.network`}
            render={({ field: networkField }) => (
              <FormItem>
                <FormLabel>{t("common.network")}</FormLabel>
                <FormControl>
                  <select
                    className="h-8 w-full rounded-lg border border-input bg-background px-2 text-sm"
                    value={networkField.value}
                    onChange={networkField.onChange}
                  >
                    {socialNetworkOptions.map((key) => (
                      <option key={key} value={key}>
                        {t(optionTranslationKey("socialNetworks", key))}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <BilingualTextInput control={form.control} name={`footer.socialLinks.${index}.label`} label={t("common.label")} />
          <FormField
            control={form.control}
            name={`footer.socialLinks.${index}.href`}
            render={({ field: hrefField }) => (
              <FormItem>
                <FormLabel>{t("common.url")}</FormLabel>
                <FormControl>
                  <Input dir="ltr" {...hrefField} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}
    </RepeaterShell>
  );
}
