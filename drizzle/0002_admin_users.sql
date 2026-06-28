CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` varchar(36) NOT NULL,
  `email` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL DEFAULT 'Admin',
  `password_hash` varchar(191) NOT NULL,
  `created_at` datetime(3) NOT NULL,
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `admin_users_email_idx` (`email`)
);
