-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(8) NOT NULL,
    `mobile` VARCHAR(20) NOT NULL,
    `imsi` VARCHAR(5) NOT NULL,
    `username` VARCHAR(256) NULL,
    `password` VARCHAR(32) NULL,
    `email` VARCHAR(128) NULL,
    `create_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `user_id_key`(`id`),
    UNIQUE INDEX `user_mobile_key`(`mobile`),
    UNIQUE INDEX `user_username_key`(`username`),
    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `base_config` (
    `id` VARCHAR(8) NOT NULL,
    `user_id` VARCHAR(8) NOT NULL,
    `type` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `other_type` VARCHAR(20) NOT NULL DEFAULT '',
    `name` VARCHAR(50) NOT NULL DEFAULT '',
    `avatar` VARCHAR(100) NOT NULL DEFAULT '',
    `bio` MEDIUMTEXT NULL,
    `platform` TEXT NULL,
    `theme_id` VARCHAR(32) NOT NULL DEFAULT '',
    `create_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `base_config_id_key`(`id`),
    UNIQUE INDEX `base_config_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `modules` (
    `id` VARCHAR(32) NOT NULL,
    `user_id` VARCHAR(8) NOT NULL,
    `json` LONGTEXT NOT NULL,
    `create_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `modules_id_key`(`id`),
    UNIQUE INDEX `modules_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `theme` (
    `id` VARCHAR(32) NOT NULL,
    `author_id` VARCHAR(8) NOT NULL,
    `type` TINYINT UNSIGNED NULL DEFAULT 1,
    `status` TINYINT UNSIGNED NULL DEFAULT 1,
    `header` TEXT NULL,
    `font` TEXT NULL,
    `background` TEXT NULL,
    `module` TEXT NULL,
    `social` TEXT NULL,
    `sharing` TEXT NULL,
    `create_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `theme_id_key`(`id`),
    INDEX `theme_author_id_fkey`(`author_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `base_config` ADD CONSTRAINT `base_config_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `modules` ADD CONSTRAINT `modules_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `theme` ADD CONSTRAINT `theme_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
