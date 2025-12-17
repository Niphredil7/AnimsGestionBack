/*
  Warnings:

  - You are about to drop the column `eventId` on the `notification` table. All the data in the column will be lost.
  - The values [EVENT] on the enum `Notification_type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `event` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `happenningId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `child` DROP FOREIGN KEY `Child_parentId_fkey`;

-- DropForeignKey
ALTER TABLE `class` DROP FOREIGN KEY `Class_userId_fkey`;

-- DropForeignKey
ALTER TABLE `event` DROP FOREIGN KEY `Event_creatorId_fkey`;

-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `Notification_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_ecoleId_fkey`;

-- DropIndex
DROP INDEX `Child_parentId_fkey` ON `child`;

-- DropIndex
DROP INDEX `Class_userId_fkey` ON `class`;

-- DropIndex
DROP INDEX `Notification_eventId_fkey` ON `notification`;

-- DropIndex
DROP INDEX `User_ecoleId_fkey` ON `user`;

-- AlterTable
ALTER TABLE `child` MODIFY `parentId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `class` MODIFY `userId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `notification` DROP COLUMN `eventId`,
    ADD COLUMN `happenningId` VARCHAR(191) NOT NULL,
    MODIFY `type` ENUM('HAPPENNING', 'ACTIVITY') NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `ecoleId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `event`;

-- CreateTable
CREATE TABLE `Happenning` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `content` TEXT NOT NULL,
    `dateStart` DATETIME(3) NOT NULL,
    `dateEnd` DATETIME(3) NOT NULL,
    `type` ENUM('RDV', 'REUNION') NOT NULL DEFAULT 'REUNION',
    `creatorId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_ecoleId_fkey` FOREIGN KEY (`ecoleId`) REFERENCES `Ecole`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Child` ADD CONSTRAINT `Child_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Class` ADD CONSTRAINT `Class_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Happenning` ADD CONSTRAINT `Happenning_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_happenningId_fkey` FOREIGN KEY (`happenningId`) REFERENCES `Happenning`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
