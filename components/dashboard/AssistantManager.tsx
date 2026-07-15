"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { Bot, GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "@/lib/toast";
import { fetchAdminChatbotData } from "@/lib/api/chatbot";
import { queryKeys } from "@/lib/query/keys";
import {
  useCreateChatbotItemMutation,
  useDeleteChatbotItemMutation,
  useUpdateChatbotItemMutation,
} from "@/hooks/use-chatbot-mutations";
import type {
  ChatbotAdminData,
  ChatbotItemRecord,
  ChatbotProductOption,
} from "@/lib/chatbot/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  productId: z.string().min(1, "Select a product."),
  titleAr: z.string().max(2000),
  titleEn: z.string().max(2000),
  descriptionAr: z.string().max(2000),
  descriptionEn: z.string().max(2000),
  redirectUrl: z
    .string()
    .max(1024)
    .refine(
      (v) => v.trim() === "" || v.startsWith("/") || /^https?:\/\//.test(v),
      "Use a relative path or an http(s) URL.",
    ),
  icon: z.string().max(64),
  isActive: z.boolean(),
  sortOrder: z.coerce.number().int().min(0).max(9999),
});

type FormValues = z.infer<typeof formSchema>;

// Sentinel select value meaning "use the product category's default icon".
const ICON_AUTO = "auto";

const EMOJI_OPTIONS = [
  "🏢", "🏠", "🛒", "🛍️", "📱", "🌐", "🤖", "☁️",
  "💼", "🚗", "🏃", "💪", "📊", "🎓", "🏥", "🚀",
  "🍔", "✈️", "🎮", "✨",
] as const;

function emptyForm(sortOrder: number): FormValues {
  return {
    productId: "",
    titleAr: "",
    titleEn: "",
    descriptionAr: "",
    descriptionEn: "",
    redirectUrl: "",
    icon: ICON_AUTO,
    isActive: true,
    sortOrder,
  };
}

function recordToForm(record: ChatbotItemRecord): FormValues {
  return {
    productId: record.productId,
    titleAr: record.title?.ar ?? "",
    titleEn: record.title?.en ?? "",
    descriptionAr: record.description?.ar ?? "",
    descriptionEn: record.description?.en ?? "",
    redirectUrl: record.redirectUrl ?? "",
    icon: record.icon?.trim() || ICON_AUTO,
    isActive: record.isActive,
    sortOrder: record.sortOrder,
  };
}

function toInput(values: FormValues) {
  return {
    productId: values.productId,
    title: { ar: values.titleAr, en: values.titleEn },
    description: { ar: values.descriptionAr, en: values.descriptionEn },
    redirectUrl: values.redirectUrl,
    icon: values.icon === ICON_AUTO ? "" : values.icon,
    isActive: values.isActive,
    sortOrder: values.sortOrder,
  };
}

export function AssistantManager({ initialData }: { initialData: ChatbotAdminData }) {
  const t = useTranslations("dashboard.assistant");
  const locale = useLocale() as "ar" | "en";

  const { data } = useQuery({
    queryKey: queryKeys.chatbot.admin,
    queryFn: fetchAdminChatbotData,
    initialData: { ok: true as const, ...initialData },
  });

  const items = data.items;
  const products = data.products;
  const productsById = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );

  const [editing, setEditing] = useState<ChatbotItemRecord | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ChatbotItemRecord | null>(null);

  const updateMutation = useUpdateChatbotItemMutation();
  const deleteMutation = useDeleteChatbotItemMutation();

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (record: ChatbotItemRecord) => {
    setEditing(record);
    setDialogOpen(true);
  };

  const handleToggleActive = (record: ChatbotItemRecord, next: boolean) => {
    updateMutation.mutate(
      { id: record.id, input: { isActive: next } },
      {
        onSuccess: () => toast.success(next ? t("enabledToast") : t("disabledToast")),
        onError: (error) => toast.error((error as Error).message),
      },
    );
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    deleteMutation.mutate(target.id, {
      onSuccess: () => {
        toast.success(t("deletedToast"));
        setDeleteTarget(null);
      },
      onError: (error) => toast.error((error as Error).message),
    });
  };

  const nextSortOrder = items.length
    ? Math.max(...items.map((item) => item.sortOrder)) + 1
    : 0;

  return (
    <div className="grid gap-6">
      <section className="rounded-[28px] border border-border/70 bg-dashboard-surface p-6 shadow-dashboard sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-dashboard-ink-muted">{t("eyebrow")}</p>
            <h1 className="mt-2 text-2xl font-semibold text-dashboard-ink">{t("title")}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-dashboard-ink-muted">
              {t("subtitle")}
            </p>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-dashboard-gulf-light text-dashboard-gulf">
            <Bot className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-5">
          <Button
            type="button"
            onClick={openCreate}
            className="rounded-xl bg-dashboard-gulf text-brand-on hover:bg-brand-deep"
          >
            <Plus className="h-4 w-4" />
            {t("addItem")}
          </Button>
        </div>
      </section>

      {items.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-border/70 bg-dashboard-surface p-10 text-center shadow-dashboard">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-dashboard-gulf-light text-dashboard-gulf">
            <Bot className="h-6 w-6" />
          </span>
          <p className="mt-4 text-base font-semibold text-dashboard-ink">{t("emptyTitle")}</p>
          <p className="mt-1 text-sm text-dashboard-ink-muted">{t("emptyBody")}</p>
        </div>
      ) : (
        <ul className="grid gap-3">
          {items.map((item) => {
            const product = productsById.get(item.productId);
            const title = item.title?.[locale]?.trim() || product?.title[locale] || item.productId;
            const redirect = item.redirectUrl?.trim() || product?.redirectUrl || "—";
            return (
              <li
                key={item.id}
                className="flex flex-wrap items-center gap-4 rounded-2xl border border-border/70 bg-dashboard-surface p-4 shadow-dashboard"
              >
                <GripVertical className="h-4 w-4 shrink-0 text-dashboard-ink-muted/60" aria-hidden />
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-muted text-lg">
                  {item.icon?.trim() || "✨"}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-dashboard-ink">{title}</p>
                    {!product ? (
                      <Badge variant="destructive" className="shrink-0">
                        {t("missingProduct")}
                      </Badge>
                    ) : null}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-dashboard-ink-muted">
                    {product ? product.title[locale] : item.productId} · {redirect}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-dashboard-ink-muted">#{item.sortOrder}</span>
                </div>

                <label className="flex shrink-0 items-center gap-2">
                  <Switch
                    checked={item.isActive}
                    onCheckedChange={(next) => handleToggleActive(item, next)}
                    disabled={updateMutation.isPending}
                    aria-label={t("activeLabel")}
                  />
                  <span
                    className={cn(
                      "text-xs font-medium",
                      item.isActive ? "text-dashboard-gulf" : "text-dashboard-ink-muted",
                    )}
                  >
                    {item.isActive ? t("statusActive") : t("statusInactive")}
                  </span>
                </label>

                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => openEdit(item)}
                    aria-label={t("edit")}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => setDeleteTarget(item)}
                    aria-label={t("delete")}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <ItemFormDialog
        key={editing?.id ?? "create"}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
        products={products}
        locale={locale}
        defaultSortOrder={nextSortOrder}
      />

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(next) => !next && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("deleteBody")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {t("confirmDelete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ItemFormDialog({
  open,
  onOpenChange,
  editing,
  products,
  locale,
  defaultSortOrder,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: ChatbotItemRecord | null;
  products: ChatbotProductOption[];
  locale: "ar" | "en";
  defaultSortOrder: number;
}) {
  const t = useTranslations("dashboard.assistant");
  const createMutation = useCreateChatbotItemMutation();
  const updateMutation = useUpdateChatbotItemMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as never,
    defaultValues: editing ? recordToForm(editing) : emptyForm(defaultSortOrder),
  });

  // Reset to a clean slate every time the dialog opens so a new option never
  // inherits values from a previous edit/create.
  useEffect(() => {
    if (open) {
      form.reset(editing ? recordToForm(editing) : emptyForm(defaultSortOrder));
    }
  }, [open, editing, defaultSortOrder, form]);

  const watchedProductId = useWatch({ control: form.control, name: "productId" });
  const selectedProduct = products.find((p) => p.id === watchedProductId);
  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = form.handleSubmit((values) => {
    const input = toInput(values);
    if (editing) {
      updateMutation.mutate(
        { id: editing.id, input },
        {
          onSuccess: () => {
            toast.success(t("savedToast"));
            onOpenChange(false);
          },
          onError: (error) => toast.error((error as Error).message),
        },
      );
    } else {
      createMutation.mutate(input, {
        onSuccess: () => {
          toast.success(t("createdToast"));
          onOpenChange(false);
        },
        onError: (error) => toast.error((error as Error).message),
      });
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? t("editTitle") : t("createTitle")}</DialogTitle>
          <DialogDescription>{t("formHint")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="grid gap-4">
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("productLabel")}</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="h-11 rounded-xl">
                        <SelectValue placeholder={t("productPlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.title[locale] || product.id}
                          {!product.isVisible ? ` (${t("hidden")})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="titleAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("titleArLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        dir="rtl"
                        placeholder={selectedProduct?.title.ar}
                        className="h-11 rounded-xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="titleEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("titleEnLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        dir="ltr"
                        placeholder={selectedProduct?.title.en}
                        className="h-11 rounded-xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="descriptionAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("descriptionArLabel")}</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        dir="rtl"
                        rows={3}
                        placeholder={selectedProduct?.defaultDescription.ar}
                        className="rounded-xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="descriptionEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("descriptionEnLabel")}</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        dir="ltr"
                        rows={3}
                        placeholder={selectedProduct?.defaultDescription.en}
                        className="rounded-xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="redirectUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("redirectLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      dir="ltr"
                      placeholder={selectedProduct?.redirectUrl ?? "/projects/slug"}
                      className="h-11 rounded-xl"
                    />
                  </FormControl>
                  <p className="text-xs text-dashboard-ink-muted">{t("redirectHint")}</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("iconLabel")}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-11 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={ICON_AUTO}>{t("iconAuto")}</SelectItem>
                        {EMOJI_OPTIONS.map((emoji) => (
                          <SelectItem key={emoji} value={emoji}>
                            <span className="text-lg leading-none">{emoji}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sortOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("sortOrderLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        value={field.value}
                        onChange={(event) => field.onChange(event.target.valueAsNumber || 0)}
                        className="h-11 rounded-xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-xl border border-border/70 px-4 py-3">
                  <FormLabel className="mb-0">{t("activeLabel")}</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="rounded-xl"
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="rounded-xl bg-dashboard-gulf text-brand-on hover:bg-brand-deep"
              >
                {isPending ? t("saving") : editing ? t("saveChanges") : t("create")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
