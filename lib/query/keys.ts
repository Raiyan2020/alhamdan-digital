export const queryKeys = {
  cms: {
    home: ["cms", "home"] as const,
    about: ["cms", "about"] as const,
    media: ["cms", "media"] as const,
  },
  blog: {
    posts: ["blog", "posts"] as const,
    post: (id: string) => ["blog", "post", id] as const,
  },
} as const;
