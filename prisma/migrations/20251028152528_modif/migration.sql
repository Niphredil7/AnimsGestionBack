/*
  Warnings:

  - You are about to drop the `userhasnotification` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `userhasnotification` DROP FOREIGN KEY `UserHasNotification_notificationId_fkey`;

-- DropForeignKey
ALTER TABLE `userhasnotification` DROP FOREIGN KEY `UserHasNotification_userId_fkey`;

-- DropTable
DROP TABLE `userhasnotification`;

-- CreateTable
CREATE TABLE `_NotificationToUser` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_NotificationToUser_AB_unique`(`A`, `B`),
    INDEX `_NotificationToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_NotificationToUser` ADD CONSTRAINT `_NotificationToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `Notification`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_NotificationToUser` ADD CONSTRAINT `_NotificationToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
