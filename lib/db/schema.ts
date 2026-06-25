import {
  boolean,
  datetime,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const localeEnum = mysqlEnum("locale", ["ar", "en"]);
export const publishStatusEnum = mysqlEnum("publish_status", [
  "draft",
  "published",
  "archived",
]);
const publishStatusValues = ["draft", "published", "archived"] as const;

export const cmsPages = mysqlTable(
  "cms_pages",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    routeKey: varchar("route_key", { length: 191 }).notNull(),
    path: varchar("path", { length: 255 }).notNull(),
    type: varchar("type", { length: 64 }).notNull().default("marketing_page"),
    status: mysqlEnum("publish_status", publishStatusValues).notNull().default("draft"),
    createdAt: datetime("created_at", { mode: "date", fsp: 3 }).notNull(),
    updatedAt: datetime("updated_at", { mode: "date", fsp: 3 }).notNull(),
    publishedAt: datetime("published_at", { mode: "date", fsp: 3 }),
  },
  (table) => ({
    routeKeyIdx: uniqueIndex("cms_pages_route_key_idx").on(table.routeKey),
    statusIdx: index("cms_pages_status_idx").on(table.status),
  }),
);

export const cmsPageLocalizations = mysqlTable(
  "cms_page_localizations",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    pageId: varchar("page_id", { length: 36 })
      .notNull()
      .references(() => cmsPages.id, { onDelete: "cascade" }),
    locale: localeEnum.notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    createdAt: datetime("created_at", { mode: "date", fsp: 3 }).notNull(),
    updatedAt: datetime("updated_at", { mode: "date", fsp: 3 }).notNull(),
  },
  (table) => ({
    pageLocaleIdx: uniqueIndex("cms_page_localizations_page_locale_idx").on(
      table.pageId,
      table.locale,
    ),
  }),
);

export const cmsPageContent = mysqlTable(
  "cms_page_content",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    pageId: varchar("page_id", { length: 36 })
      .notNull()
      .references(() => cmsPages.id, { onDelete: "cascade" }),
    status: mysqlEnum("publish_status", publishStatusValues).notNull().default("draft"),
    contentJson: json("content_json").notNull(),
    renderedHtmlJson: json("rendered_html_json").notNull(),
    seoJson: json("seo_json").notNull(),
    version: int("version").notNull().default(1),
    createdAt: datetime("created_at", { mode: "date", fsp: 3 }).notNull(),
    updatedAt: datetime("updated_at", { mode: "date", fsp: 3 }).notNull(),
    publishedAt: datetime("published_at", { mode: "date", fsp: 3 }),
  },
  (table) => ({
    pageStatusIdx: uniqueIndex("cms_page_content_page_status_idx").on(
      table.pageId,
      table.status,
    ),
  }),
);

export const mediaAssets = mysqlTable("media_assets", {
  id: varchar("id", { length: 36 }).primaryKey(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  url: varchar("url", { length: 1024 }).notNull(),
  mimeType: varchar("mime_type", { length: 128 }).notNull(),
  sizeBytes: int("size_bytes"),
  width: int("width"),
  height: int("height"),
  title: varchar("title", { length: 255 }).notNull(),
  isDecorative: boolean("is_decorative").notNull().default(false),
  focalX: int("focal_x"),
  focalY: int("focal_y"),
  createdAt: datetime("created_at", { mode: "date", fsp: 3 }).notNull(),
  updatedAt: datetime("updated_at", { mode: "date", fsp: 3 }).notNull(),
});

export const mediaAssetLocalizations = mysqlTable(
  "media_asset_localizations",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    mediaAssetId: varchar("media_asset_id", { length: 36 })
      .notNull()
      .references(() => mediaAssets.id, { onDelete: "cascade" }),
    locale: localeEnum.notNull(),
    title: varchar("title", { length: 255 }),
    altText: text("alt_text"),
    caption: text("caption"),
  },
  (table) => ({
    mediaLocaleIdx: uniqueIndex("media_asset_localizations_media_locale_idx").on(
      table.mediaAssetId,
      table.locale,
    ),
  }),
);

export const cmsVersions = mysqlTable(
  "cms_versions",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    pageId: varchar("page_id", { length: 36 })
      .notNull()
      .references(() => cmsPages.id, { onDelete: "cascade" }),
    status: publishStatusEnum.notNull(),
    version: int("version").notNull(),
    snapshotJson: json("snapshot_json").notNull(),
    createdBy: varchar("created_by", { length: 191 }),
    createdAt: datetime("created_at", { mode: "date", fsp: 3 }).notNull(),
    publishedAt: datetime("published_at", { mode: "date", fsp: 3 }),
  },
  (table) => ({
    pageVersionIdx: uniqueIndex("cms_versions_page_version_idx").on(
      table.pageId,
      table.version,
    ),
  }),
);

export const blogPosts = mysqlTable(
  "blog_posts",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    slug: varchar("slug", { length: 191 }).notNull(),
    status: publishStatusEnum.notNull().default("draft"),
    contentJson: json("content_json").notNull(),
    publishedAt: datetime("published_at", { mode: "date", fsp: 3 }),
    createdAt: datetime("created_at", { mode: "date", fsp: 3 }).notNull(),
    updatedAt: datetime("updated_at", { mode: "date", fsp: 3 }).notNull(),
  },
  (table) => ({
    slugIdx: uniqueIndex("blog_posts_slug_idx").on(table.slug),
    statusIdx: index("blog_posts_status_idx").on(table.status),
    publishedAtIdx: index("blog_posts_published_at_idx").on(table.publishedAt),
  }),
);
