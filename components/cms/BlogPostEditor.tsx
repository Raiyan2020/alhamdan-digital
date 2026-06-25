"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, Save, Send } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch, type FieldErrors } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";
import { handleFormValidationFailure } from "@/lib/cms/form-submit";
import { getErrorMessage } from "@/lib/api/errors";
import type { BlogPostStatus, CmsBlogPostPayload } from "@/lib/cms/blog-types";
import {
  createEmptyBlogPostPayload,
  cmsBlogPostPayloadSchema,
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
  status: z.enum(["draft", "published", "archived"]),
});

type BlogPostFormValues = z.infer<typeof blogPostFormSchema>;

type BlogPostEditorProps = {
  postId: string | null;
  embedded?: boolean;
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

export function BlogPostEditor({ postId, embedded = false, onBack }: BlogPostEditorProps) {
  const t = useTranslations("cms.blog");
  const locale = useLocale();
  const [message, setMessage] = useState<string | null>(null);
  const [messageVariant, setMessageVariant] = useState<"success" | "error">("success");
  const { data: existingPost, isLoading } = useBlogPostQuery(postId);
  const createMutation = useCreateBlogPostMutation();
  const updateMutation = useUpdateBlogPostMutation();

  const defaultValues = useMemo<BlogPostFormValues>(() => {
    if (existingPost) {
      return {
        status: existingPost.status,
        ...existingPost.payload,
      };
    }

    return {
      status: "draft",
      ...createEmptyBlogPostPayload(),
    };
  }, [existingPost]);

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostFormSchema) as never,
    defaultValues,
    mode: "onBlur",
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const englishTitle = useWatch({ control: form.control, name: "title.en" });
  const slug = useWatch({ control: form.control, name: "slug" });
  const status = useWatch({ control: form.control, name: "status" });
  const isSaving = createMutation.isPending || updateMutation.isPending;
  const previewHref = status === "published" && slug ? `/blog/${slug}` : null;

  useEffect(() => {
    if (!postId && englishTitle && !form.formState.dirtyFields.slug) {
      const nextSlug = slugifyBlogText(englishTitle);
      if (nextSlug) form.setValue("slug", nextSlug, { shouldDirty: false });
    }
  }, [englishTitle, form, postId]);

  const savePost = (nextStatus: BlogPostStatus) => {
    setMessage(null);
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
            onSuccess: () => {
              onSuccess();
              onBack();
            },
            onError,
          },
        );
      },
      (errors: FieldErrors<BlogPostFormValues>) => {
        const result = handleFormValidationFailure(form, errors, {
          validationMessage: (count) => t("validationFailed", { count }),
        });
        setMessageVariant("error");
        setMessage(result.message);
      },
    )();
  };

  if (postId && isLoading) {
    return <div className="p-8 text-sm text-dashboard-ink-muted">{t("loading")}</div>;
  }

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
