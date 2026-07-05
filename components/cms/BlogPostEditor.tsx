"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, Save, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch, type FieldErrors } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";
import { handleFormValidationFailure } from "@/lib/cms/form-submit";
import { getErrorMessage } from "@/lib/api/errors";
import type { BlogPostStatus, CmsBlogPostPayload, CmsBlogPostRecord } from "@/lib/cms/blog-types";
import {
  createEmptyBlogPostPayload,
  cmsBlogPostPayloadSchema,
  blogPostStatusSchema,
} from "@/lib/cms/blog-validation";
import { slugifyBlogText } from "@/lib/cms/blog-slug";
import {
  useBlogPostQuery,
  useCreateBlogPostMutation,
  useUpdateBlogPostMutation,
} from "@/hooks/use-blog-mutations";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SlugInput } from "@/components/ui/slug-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BilingualTextInput, BilingualTipTapField } from "./BilingualFields";
import { LocalizedMediaPicker } from "./LocalizedMediaPicker";
import { cn } from "@/lib/utils";

const blogPostFormSchema = cmsBlogPostPayloadSchema.extend({
  status: blogPostStatusSchema,
});

type BlogPostFormValues = z.infer<typeof blogPostFormSchema>;

type BlogPostEditorProps = {
  postId: string | null;
  embedded?: boolean;
  onCreated?: (post: CmsBlogPostRecord) => void;
  onBack: () => void;
};

type BlogEditorActionsProps = {
  isSaving: boolean;
  onSaveDraft: () => void;
  onPublish: () => void;
  previewHref: string | null;
  previewLabel: string;
  saveLabel: string;
  publishLabel: string;
};

function BlogEditorActions({
  isSaving,
  onSaveDraft,
  onPublish,
  previewHref,
  previewLabel,
  saveLabel,
  publishLabel,
}: BlogEditorActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {previewHref ? (
        <Button type="button" variant="outline" className="rounded-full" asChild>
          <Link href={previewHref} target="_blank" rel="noreferrer">
            <Eye className="me-2 h-4 w-4" />
            {previewLabel}
          </Link>
        </Button>
      ) : null}
      <Button
        type="button"
        variant="outline"
        className="rounded-full"
        disabled={isSaving}
        onClick={onSaveDraft}
      >
        <Save className="me-2 h-4 w-4" />
        {saveLabel}
      </Button>
      <Button
        type="button"
        className="rounded-full bg-dashboard-gulf text-brand-on hover:bg-dashboard-gulf/90"
        disabled={isSaving}
        onClick={onPublish}
      >
        <Send className="me-2 h-4 w-4" />
        {publishLabel}
      </Button>
    </div>
  );
}

/**
 * Public entry point. Handles data loading and only renders the form
 * once data is ready so that useForm can initialize with the correct values.
 */
export function BlogPostEditor({
  postId,
  embedded = false,
  onCreated,
  onBack,
}: BlogPostEditorProps) {
  const t = useTranslations("cms.blog");
  const { data: existingPost, isLoading } = useBlogPostQuery(postId);

  if (postId && isLoading) {
    return <div className="p-8 text-sm text-dashboard-ink-muted">{t("loading")}</div>;
  }

  // By this point either:
  // - postId is null  → creating a new post
  // - existingPost is defined → editing an existing post (data is ready)
  return (
    <BlogPostEditorForm
      postId={postId}
      existingPost={existingPost ?? null}
      embedded={embedded}
      onCreated={onCreated}
      onBack={onBack}
    />
  );
}

type BlogPostEditorFormProps = {
  postId: string | null;
  existingPost: CmsBlogPostRecord | null;
  embedded?: boolean;
  onCreated?: (post: CmsBlogPostRecord) => void;
  onBack: () => void;
};

/**
 * Inner form component. Only mounts after data is ready, so useForm
 * can initialize with the correct defaultValues immediately — no
 * useEffect + form.reset workaround needed.
 */
function BlogPostEditorForm({
  postId,
  existingPost,
  embedded = false,
  onCreated,
  onBack,
}: BlogPostEditorFormProps) {
  const t = useTranslations("cms.blog");
  const tCommon = useTranslations("cms.common");
  const locale = useLocale();
  const [message, setMessage] = useState<string | null>(null);
  const [messageVariant, setMessageVariant] = useState<"success" | "error">("success");
  const [validationItems, setValidationItems] = useState<string[]>([]);
  const createMutation = useCreateBlogPostMutation();
  const updateMutation = useUpdateBlogPostMutation();

  // existingPost is guaranteed to be defined when postId is set (caller waits for load).
  // Build defaultValues once — they won't change while this component is mounted.
  const defaultValues: BlogPostFormValues = existingPost
    ? { status: existingPost.status, ...existingPost.payload }
    : { status: "draft", ...createEmptyBlogPostPayload() };

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostFormSchema) as never,
    defaultValues,
    mode: "onBlur",
  });

  const englishTitle = useWatch({ control: form.control, name: "title.en" });
  const slug = useWatch({ control: form.control, name: "slug" });
  const status = useWatch({ control: form.control, name: "status" });
  const isSaving = createMutation.isPending || updateMutation.isPending;
  const previewHref = status === "published" && slug ? `/blogs/${slug}` : null;

  // Auto-generate slug from English title when creating a new post.
  useEffect(() => {
    if (!postId && englishTitle && !form.formState.dirtyFields.slug) {
      const nextSlug = slugifyBlogText(englishTitle);
      if (nextSlug) form.setValue("slug", nextSlug, { shouldDirty: false });
    }
  }, [englishTitle, form, postId]);

  const savePost = (nextStatus: BlogPostStatus) => {
    setMessage(null);
    setValidationItems([]);
    form.setValue("status", nextStatus);

    form.handleSubmit(
      (values) => {
        const { status: formStatus, ...payload } = values;

        const onSuccess = () => {
          const text =
            formStatus === "published"
              ? t("publishedSuccess")
              : postId
                ? t("draftUpdated")
                : t("draftCreated");
          setMessageVariant("success");
          setMessage(text);
          setValidationItems([]);
          toast.success(text);
        };

        const onError = (error: Error) => {
          const text = getErrorMessage(error);
          setMessageVariant("error");
          setMessage(text);
        };

        if (postId) {
          updateMutation.mutate(
            { id: postId, status: formStatus, payload: payload as CmsBlogPostPayload },
            { onSuccess, onError },
          );
          return;
        }

        createMutation.mutate(
          { status: formStatus, payload: payload as CmsBlogPostPayload },
          {
            onSuccess: (response) => {
              onSuccess();
              onCreated?.(response.post);
            },
            onError,
          },
        );
      },
      (errors: FieldErrors<BlogPostFormValues>) => {
        const result = handleFormValidationFailure(form, errors, {
          validationMessage: (count) => t("validationFailed", { count }),
        });
        const details = result.paths
          .map((path) => describeBlogErrorPath(path, { field: (key) => t(`fields.${key}`), common: tCommon }))
          .filter(Boolean);
        setMessageVariant("error");
        setMessage(result.message);
        setValidationItems(Array.from(new Set(details)).slice(0, 6));
      },
    )();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" className="rounded-full" onClick={onBack}>
            <ArrowLeft className="me-2 h-4 w-4" />
            {t("backToList")}
          </Button>
          <div>
            <h2 className="text-2xl font-semibold text-dashboard-ink">
              {postId ? t("editPost") : t("newPost")}
            </h2>
            <p className="text-sm text-dashboard-ink-muted">{t("editorBody")}</p>
          </div>
        </div>
        <BlogEditorActions
          isSaving={isSaving}
          onSaveDraft={() => savePost("draft")}
          onPublish={() => savePost("published")}
          previewHref={previewHref}
          previewLabel={t("preview")}
          saveLabel={t("saveDraft")}
          publishLabel={t("publish")}
        />
      </div>

      {message ? (
        <div
          className={cn(
            "rounded-2xl border px-4 py-3 text-sm",
            messageVariant === "error"
              ? "border-destructive/40 bg-destructive/10 text-destructive"
              : "border-border/70 bg-dashboard-gulf-light text-dashboard-ink",
          )}
        >
          {message}
          {messageVariant === "error" && validationItems.length > 0 ? (
            <ul className="mt-2 list-disc space-y-1 ps-5 text-xs leading-5">
              {validationItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <Form {...form}>
        <form className="space-y-6">
          <Card className="border-border/70 bg-dashboard-surface shadow-dashboard">
            <CardHeader className="border-b border-border/50 px-6 py-5 sm:px-8">
              <CardTitle className="text-lg">{t("sections.settings")}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 px-6 py-6 sm:px-8">
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.slug")}</FormLabel>
                    <FormControl>
                      <SlugInput placeholder={t("placeholders.slug")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.category")}</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="insights">{t("categories.insights")}</SelectItem>
                          <SelectItem value="news">{t("categories.news")}</SelectItem>
                          <SelectItem value="guides">{t("categories.guides")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="authorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.author")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.tags")}</FormLabel>
                    <FormControl>
                      <Input
                        dir="ltr"
                        value={field.value.join(", ")}
                        onChange={(event) => {
                          const tags = event.target.value
                            .split(",")
                            .map((tag) => tag.trim())
                            .filter(Boolean);
                          field.onChange(tags);
                        }}
                        placeholder={t("placeholders.tags")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-dashboard-surface shadow-dashboard">
            <CardHeader className="border-b border-border/50 px-6 py-5 sm:px-8">
              <CardTitle className="text-lg">{t("sections.content")}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 px-6 py-6 sm:px-8">
              <BilingualTextInput control={form.control} name="title" label={t("fields.title")} />
              <BilingualTextInput
                control={form.control}
                name="excerpt"
                label={t("fields.excerpt")}
              />
              <LocalizedMediaPicker
                control={form.control}
                name="coverImage"
                label={t("fields.coverImage")}
              />
              <BilingualTipTapField control={form.control} name="body" label={t("fields.body")} />
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-dashboard-surface shadow-dashboard">
            <CardHeader className="border-b border-border/50 px-6 py-5 sm:px-8">
              <CardTitle className="text-lg">{t("sections.seo")}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 px-6 py-6 sm:px-8">
              <BilingualTextInput
                control={form.control}
                name="seo.metaTitle"
                label={t("fields.metaTitle")}
              />
              <BilingualTextInput
                control={form.control}
                name="seo.metaDescription"
                label={t("fields.metaDescription")}
              />
              <BilingualTextInput
                control={form.control}
                name="seo.ogTitle"
                label={t("fields.ogTitle")}
              />
              <BilingualTextInput
                control={form.control}
                name="seo.ogDescription"
                label={t("fields.ogDescription")}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end border-t border-border/60 pt-6">
            <BlogEditorActions
              isSaving={isSaving}
              onSaveDraft={() => savePost("draft")}
              onPublish={() => savePost("published")}
              previewHref={previewHref}
              previewLabel={t("preview")}
              saveLabel={t("saveDraft")}
              publishLabel={t("publish")}
            />
          </div>
        </form>
      </Form>

      {!embedded ? null : (
        <p className="text-xs text-dashboard-ink-muted">
          {locale === "ar" ? t("editorHintAr") : t("editorHintEn")}
        </p>
      )}
    </div>
  );
}

function describeBlogErrorPath(
  path: string,
  labels: {
    field: (key: string) => string;
    common: (key: string) => string;
  },
) {
  const parts = path.split(".");
  const language = parts.includes("ar")
    ? labels.common("arabic")
    : parts.includes("en")
      ? labels.common("english")
      : null;

  const exactLabels: Array<[string, string]> = [
    ["slug", labels.field("slug")],
    ["category", labels.field("category")],
    ["authorName", labels.field("author")],
    ["tags", labels.field("tags")],
    ["title", labels.field("title")],
    ["excerpt", labels.field("excerpt")],
    ["coverImage.defaultUrl", labels.field("coverImage")],
    ["coverImage.alt", labels.common("altText")],
    ["body.html", labels.field("body")],
    ["body.json", labels.field("body")],
    ["seo.metaTitle", labels.field("metaTitle")],
    ["seo.metaDescription", labels.field("metaDescription")],
    ["seo.ogTitle", labels.field("ogTitle")],
    ["seo.ogDescription", labels.field("ogDescription")],
  ];

  const fieldLabel = exactLabels.find(([key]) => path.startsWith(key))?.[1] ?? path;
  return language ? `${fieldLabel} (${language})` : fieldLabel;
}
