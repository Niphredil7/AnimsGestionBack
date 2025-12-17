/*
  Warnings:

  - You are about to drop the column `seen` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the `_notificationtouser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_notificationtouser` DROP FOREIGN KEY `_NotificationToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_notificationtouser` DROP FOREIGN KEY `_NotificationToUser_B_fkey`;

-- AlterTable
ALTER TABLE `notification` DROP COLUMN `seen`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- DropTable
DROP TABLE `_notificationtouser`;

-- CreateTable
CREATE TABLE `UserHasNotification` (
    `notificationId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `seen` BOOLEAN NOT NULL,

    PRIMARY KEY (`notificationId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserHasNotification` ADD CONSTRAINT `UserHasNotification_notificationId_fkey` FOREIGN KEY (`notificationId`) REFERENCES `Notification`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserHasNotification` ADD CONSTRAINT `UserHasNotification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
