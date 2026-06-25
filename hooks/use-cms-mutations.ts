"use client";

import { useMutation } from "@tanstack/react-query";
import { saveAboutPage, saveHomePage, uploadCmsMedia } from "@/lib/api/cms";
import type { CmsAboutPayload, CmsHomePayload } from "@/lib/cms/types";

export function useSaveHomePageMutation() {
  return useMutation({
    mutationFn: saveHomePage,
  });
}

export function useSaveAboutPageMutation() {
  return useMutation({
    mutationFn: saveAboutPage,
  });
}

export function useUploadCmsMediaMutation() {
  return useMutation({
    mutationFn: uploadCmsMedia,
  });
}

export type { CmsAboutPayload, CmsHomePayload };
