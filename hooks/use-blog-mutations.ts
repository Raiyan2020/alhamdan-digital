"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBlogPost,
  deleteBlogPost,
  getBlogPost,
  listBlogPosts,
  updateBlogPost,
} from "@/lib/api/blog";
import type { BlogPostStatus, CmsBlogPostPayload } from "@/lib/cms/blog-types";
import { queryKeys } from "@/lib/query/keys";

export function useBlogPostsQuery() {
  return useQuery({
    queryKey: queryKeys.blog.posts,
    queryFn: async () => {
      const data = await listBlogPosts();
      return data.posts;
    },
  });
}

export function useBlogPostQuery(id: string | null) {
  return useQuery({
    queryKey: queryKeys.blog.post(id ?? "new"),
    queryFn: async () => {
      if (!id) return null;
      const data = await getBlogPost(id);
      return data.post;
    },
    enabled: Boolean(id),
  });
}

export function useCreateBlogPostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { status: BlogPostStatus; payload: CmsBlogPostPayload }) =>
      createBlogPost(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blog.posts });
    },
  });
}

export function useUpdateBlogPostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...input
    }: {
      id: string;
      status?: BlogPostStatus;
      payload?: CmsBlogPostPayload;
    }) => updateBlogPost(id, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blog.posts });
      queryClient.invalidateQueries({ queryKey: queryKeys.blog.post(variables.id) });
    },
  });
}

export function useDeleteBlogPostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBlogPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blog.posts });
    },
  });
}
