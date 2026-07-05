"use client";

import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { ExternalLink, FilePlus2, Pencil, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import type { CmsBlogPostRecord } from "@/lib/cms/blog-types";
import { useBlogPostsQuery, useDeleteBlogPostMutation } from "@/hooks/use-blog-mutations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { BlogPostEditor } from "./BlogPostEditor";

type BlogManagerProps = {
  embedded?: boolean;
};

export function BlogManager({ embedded = false }: BlogManagerProps) {
  const t = useTranslations("cms.blog");
  const locale = useLocale();
  const { data: posts = [], isLoading, refetch } = useBlogPostsQuery();
  const deleteMutation = useDeleteBlogPostMutation();
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CmsBlogPostRecord | null>(null);

  if (editingId) {
    return (
      <BlogPostEditor
        postId={editingId === "new" ? null : editingId}
        embedded={embedded}
        onCreated={(post) => setEditingId(post.id)}
        onBack={() => {
          setEditingId(null);
          refetch();
        }}
      />
    );
  }

  const dateLocale = locale === "ar" ? ar : enUS;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-dashboard-ink">{t("managerTitle")}</h2>
          <p className="mt-1 max-w-2xl text-sm text-dashboard-ink-muted">{t("managerBody")}</p>
        </div>
        <Button
          type="button"
          className="rounded-full bg-dashboard-gulf text-brand-on hover:bg-dashboard-gulf/90"
          onClick={() => setEditingId("new")}
        >
          <FilePlus2 className="me-2 h-4 w-4" />
          {t("newPost")}
        </Button>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-border/70 bg-dashboard-surface shadow-dashboard">
        {isLoading ? (
          <div className="p-8 text-sm text-dashboard-ink-muted">{t("loading")}</div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-base font-medium text-dashboard-ink">{t("emptyTitle")}</p>
            <p className="mt-2 text-sm text-dashboard-ink-muted">{t("emptyBody")}</p>
          </div>
        ) : (
          <div className="divide-y divide-border/70">
            {posts.map((post) => {
              const title =
                locale === "ar" ? post.payload.title.ar : post.payload.title.en;

              return (
                <div
                  key={post.id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                >
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-base font-semibold text-dashboard-ink">
                        {title || post.slug}
                      </h3>
                      <StatusBadge status={post.status} />
                      <Badge variant="outline" className="font-normal">
                        {t(`categories.${post.payload.category}`)}
                      </Badge>
                    </div>
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto justify-start p-0 text-sm font-normal text-dashboard-gulf"
                      asChild
                    >
                      <Link href={`/blogs/${post.slug}`} target="_blank" rel="noreferrer" dir="ltr">
                        /blogs/{post.slug}
                        <ExternalLink className="ms-1 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                    <p className="text-xs text-dashboard-ink-muted">
                      {post.updatedAt
                        ? format(new Date(post.updatedAt), "PPp", { locale: dateLocale })
                        : null}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full"
                      onClick={() => setEditingId(post.id)}
                    >
                      <Pencil className="me-2 h-4 w-4" />
                      {t("edit")}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full text-destructive hover:text-destructive"
                      onClick={() => setDeleteTarget(post)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("deleteBody")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => {
                if (!deleteTarget) return;
                deleteMutation.mutate(deleteTarget.id, {
                  onSuccess: () => {
                    setDeleteTarget(null);
                    toast.success(t("deletedSuccess"));
                  },
                });
              }}
            >
              {t("confirmDelete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function StatusBadge({ status }: { status: CmsBlogPostRecord["status"] }) {
  const t = useTranslations("cms.blog.status");

  const styles = {
    draft: "bg-dashboard-sand text-dashboard-ink",
    published: "bg-dashboard-palm-light text-dashboard-palm",
    archived: "bg-muted text-muted-foreground",
  } as const;

  return (
    <Badge className={styles[status]} variant="secondary">
      {t(status)}
    </Badge>
  );
}
