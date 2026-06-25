import type { BlogPostStatus, CmsBlogPostPayload, CmsBlogPostRecord } from "@/lib/cms/blog-types";
import { apiFetch } from "./client";

type BlogPostsResponse = {
  ok: true;
  posts: CmsBlogPostRecord[];
};

type BlogPostResponse = {
  ok: true;
  message?: string;
  post: CmsBlogPostRecord;
};

export async function listBlogPosts() {
  return apiFetch<BlogPostsResponse>("/api/admin/cms/blog/posts");
}

export async function getBlogPost(id: string) {
  return apiFetch<BlogPostResponse>(`/api/admin/cms/blog/posts/${id}`);
}

export async function createBlogPost(input: {
  status: BlogPostStatus;
  payload: CmsBlogPostPayload;
}) {
  return apiFetch<BlogPostResponse>("/api/admin/cms/blog/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input.payload, status: input.status }),
  });
}

export async function updateBlogPost(
  id: string,
  input: { status?: BlogPostStatus; payload?: CmsBlogPostPayload },
) {
  return apiFetch<BlogPostResponse>(`/api/admin/cms/blog/posts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export async function deleteBlogPost(id: string) {
  return apiFetch<{ ok: true; message?: string }>(`/api/admin/cms/blog/posts/${id}`, {
    method: "DELETE",
  });
}
