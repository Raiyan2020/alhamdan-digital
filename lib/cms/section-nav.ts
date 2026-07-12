export type CmsSectionGroup = {
  groupKey: string;
  items: readonly string[];
};

export const HOME_CMS_SECTIONS: readonly CmsSectionGroup[] = [
  { groupKey: "settings", items: ["seo", "shell", "nav"] },
  { groupKey: "hero", items: ["hero"] },
  {
    groupKey: "content",
    items: ["about", "vision", "process", "products", "services", "sectors", "why", "market"],
  },
  { groupKey: "footer", items: ["footer"] },
] as const;

export const ABOUT_CMS_SECTIONS: readonly CmsSectionGroup[] = [
  { groupKey: "settings", items: ["seo"] },
  { groupKey: "content", items: ["hero"] },
] as const;
