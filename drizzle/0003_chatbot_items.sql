CREATE TABLE IF NOT EXISTS `chatbot_items` (
  `id` varchar(36) NOT NULL,
  `product_id` varchar(191) NOT NULL,
  `title_json` json NULL,
  `description_json` json NULL,
  `redirect_url` varchar(1024) NULL,
  `icon` varchar(64) NULL,
  `is_active` boolean NOT NULL DEFAULT true,
  `sort_order` int NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL,
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `chatbot_items_active_sort_idx` (`is_active`, `sort_order`),
  KEY `chatbot_items_product_idx` (`product_id`)
);
