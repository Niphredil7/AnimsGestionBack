/*
  Warnings:

  - You are about to drop the column `activityOutingId` on the `planning` table. All the data in the column will be lost.
  - You are about to drop the `activityouting` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `activityId` to the `Planning` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outingId` to the `Planning` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `activityouting` DROP FOREIGN KEY `ActivityOuting_categoryMaterialId_fkey`;

-- DropForeignKey
ALTER TABLE `activityouting` DROP FOREIGN KEY `ActivityOuting_roomId_fkey`;

-- DropForeignKey
ALTER TABLE `activityouting` DROP FOREIGN KEY `ActivityOuting_userId_fkey`;

-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `Notification_activityOutingId_fkey`;

-- DropForeignKey
ALTER TABLE `planning` DROP FOREIGN KEY `Planning_activityOutingId_fkey`;

-- DropIndex
DROP INDEX `Notification_activityOutingId_fkey` ON `notification`;

-- DropIndex
DROP INDEX `Planning_activityOutingId_fkey` ON `planning`;

-- AlterTable
ALTER TABLE `planning` DROP COLUMN `activityOutingId`,
    ADD COLUMN `activityId` VARCHAR(191) NOT NULL,
    ADD COLUMN `outingId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `activityouting`;

-- CreateTable
CREATE TABLE `Activity` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `content` VARCHAR(300) NULL,
    `img` VARCHAR(200) NULL,
    `favorite` ENUM('IsNotFavorite', 'IsFavorite') NOT NULL DEFAULT 'IsNotFavorite',
    `userId` VARCHAR(191) NOT NULL,
    `roomId` VARCHAR(191) NOT NULL,
    `categoryMaterialId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `validatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Outing` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `content` VARCHAR(300) NULL,
    `img` VARCHAR(200) NULL,
    `localisation` VARCHAR(200) NULL,
    `favorite` ENUM('IsNotFavorite', 'IsFavorite') NOT NULL DEFAULT 'IsNotFavorite',
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `validatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_NotificationToOuting` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_NotificationToOuting_AB_unique`(`A`, `B`),
    INDEX `_NotificationToOuting_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Activity` ADD CONSTRAINT `Activity_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Activity` ADD CONSTRAINT `Activity_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Activity` ADD CONSTRAINT `Activity_categoryMaterialId_fkey` FOREIGN KEY (`categoryMaterialId`) REFERENCES `CategoryMaterial`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Outing` ADD CONSTRAINT `Outing_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Planning` ADD CONSTRAINT `Planning_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `Activity`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Planning` ADD CONSTRAINT `Planning_outingId_fkey` FOREIGN KEY (`outingId`) REFERENCES `Outing`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_activityOutingId_fkey` FOREIGN KEY (`activityOutingId`) REFERENCES `Activity`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_NotificationToOuting` ADD CONSTRAINT `_NotificationToOuting_A_fkey` FOREIGN KEY (`A`) REFERENCES `Notification`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_NotificationToOuting` ADD CONSTRAINT `_NotificationToOuting_B_fkey` FOREIGN KEY (`B`) REFERENCES `Outing`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
