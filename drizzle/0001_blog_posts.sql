CREATE TABLE IF NOT EXISTS `blog_posts` (
  `id` varchar(36) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
  `content_json` json NOT NULL,
  `published_at` datetime(3) NULL,
  `created_at` datetime(3) NOT NULL,
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `blog_posts_slug_idx` (`slug`),
  KEY `blog_posts_status_idx` (`status`),
  KEY `blog_posts_published_at_idx` (`published_at`)
);
