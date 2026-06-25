import type { CmsAboutPayload, CmsHomePayload } from "@/lib/cms/types";
import { apiFetch } from "./client";

type SavePageResponse = {
  ok: true;
  message?: string;
  version?: number;
  content?: CmsAboutPayload | CmsHomePayload;
};

type UploadMediaResponse = {
  ok: true;
  message?: string;
  asset: {
    id: string;
    url: string;
  };
};

export type UploadCmsMediaInput = {
  file: File;
  preserveDimensions?: boolean;
};

export async function saveHomePage(values: CmsHomePayload) {
  return apiFetch<SavePageResponse>("/api/admin/cms/pages/home", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
}

export async function saveAboutPage(values: CmsAboutPayload) {
  return apiFetch<SavePageResponse>("/api/admin/cms/pages/about", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
}

export async function uploadCmsMedia({ file, preserveDimensions = false }: UploadCmsMediaInput) {
  const formData = new FormData();
  formData.append("file", file);
  if (preserveDimensions) formData.append("preserveDimensions", "true");

  return apiFetch<UploadMediaResponse>("/api/admin/cms/media", {
    method: "POST",
    body: formData,
  });
}
