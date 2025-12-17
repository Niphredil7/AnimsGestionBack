/*
  Warnings:

  - You are about to drop the column `picture` on the `activity` table. All the data in the column will be lost.
  - You are about to drop the column `activityOutingId` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `picture` on the `outing` table. All the data in the column will be lost.
  - You are about to drop the `_notificationtoouting` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_notificationtoouting` DROP FOREIGN KEY `_NotificationToOuting_A_fkey`;

-- DropForeignKey
ALTER TABLE `_notificationtoouting` DROP FOREIGN KEY `_NotificationToOuting_B_fkey`;

-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `Notification_activityOutingId_fkey`;

-- DropForeignKey
ALTER TABLE `planningactivity` DROP FOREIGN KEY `PlanningActivity_planningId_fkey`;

-- DropIndex
DROP INDEX `Notification_activityOutingId_fkey` ON `notification`;

-- AlterTable
ALTER TABLE `activity` DROP COLUMN `picture`;

-- AlterTable
ALTER TABLE `feedback` MODIFY `status` ENUM('IsNotFavorite', 'IsFavorite') NOT NULL DEFAULT 'IsFavorite';

-- AlterTable
ALTER TABLE `notification` DROP COLUMN `activityOutingId`,
    ADD COLUMN `planningActivityId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `outing` DROP COLUMN `picture`;

-- AlterTable
ALTER TABLE `planningactivity` MODIFY `planningId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `_notificationtoouting`;

-- AddForeignKey
ALTER TABLE `PlanningActivity` ADD CONSTRAINT `PlanningActivity_planningId_fkey` FOREIGN KEY (`planningId`) REFERENCES `Planning`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_planningActivityId_fkey` FOREIGN KEY (`planningActivityId`) REFERENCES `PlanningActivity`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
