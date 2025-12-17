/*
  Warnings:

  - You are about to drop the column `img` on the `activity` table. All the data in the column will be lost.
  - You are about to drop the column `img` on the `outing` table. All the data in the column will be lost.
  - You are about to drop the column `activityId` on the `planning` table. All the data in the column will be lost.
  - You are about to drop the column `dateEnd` on the `planning` table. All the data in the column will be lost.
  - You are about to drop the column `outingId` on the `planning` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `planning` table. All the data in the column will be lost.
  - You are about to drop the column `validatedAt` on the `planning` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `school` table. All the data in the column will be lost.
  - You are about to drop the `_classtoplanning` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `localisation` on table `outing` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `zipCode` to the `School` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_classtoplanning` DROP FOREIGN KEY `_ClassToPlanning_A_fkey`;

-- DropForeignKey
ALTER TABLE `_classtoplanning` DROP FOREIGN KEY `_ClassToPlanning_B_fkey`;

-- DropForeignKey
ALTER TABLE `feedback` DROP FOREIGN KEY `Feedback_planningId_fkey`;

-- DropForeignKey
ALTER TABLE `planning` DROP FOREIGN KEY `Planning_activityId_fkey`;

-- DropForeignKey
ALTER TABLE `planning` DROP FOREIGN KEY `Planning_outingId_fkey`;

-- DropIndex
DROP INDEX `Planning_activityId_fkey` ON `planning`;

-- DropIndex
DROP INDEX `Planning_outingId_fkey` ON `planning`;

-- AlterTable
ALTER TABLE `activity` DROP COLUMN `img`,
    ADD COLUMN `picture` VARCHAR(200) NULL;

-- AlterTable
ALTER TABLE `outing` DROP COLUMN `img`,
    ADD COLUMN `picture` VARCHAR(200) NULL,
    MODIFY `localisation` VARCHAR(200) NOT NULL;

-- AlterTable
ALTER TABLE `planning` DROP COLUMN `activityId`,
    DROP COLUMN `dateEnd`,
    DROP COLUMN `outingId`,
    DROP COLUMN `status`,
    DROP COLUMN `validatedAt`;

-- AlterTable
ALTER TABLE `school` DROP COLUMN `postalCode`,
    ADD COLUMN `zipCode` INTEGER NOT NULL;

-- DropTable
DROP TABLE `_classtoplanning`;

-- CreateTable
CREATE TABLE `PlanningActivity` (
    `id` VARCHAR(191) NOT NULL,
    `moment` ENUM('MORNING', 'MIDI', 'EVENING') NOT NULL,
    `validatedAt` DATETIME(3) NULL,
    `activityId` VARCHAR(191) NULL,
    `outingId` VARCHAR(191) NULL,
    `planningId` VARCHAR(191) NOT NULL,
    `classId` VARCHAR(191) NOT NULL,
    `day` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PlanningActivity_planningId_activityId_outingId_classId_mome_key`(`planningId`, `activityId`, `outingId`, `classId`, `moment`, `day`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PlanningActivity` ADD CONSTRAINT `PlanningActivity_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `Activity`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlanningActivity` ADD CONSTRAINT `PlanningActivity_outingId_fkey` FOREIGN KEY (`outingId`) REFERENCES `Outing`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlanningActivity` ADD CONSTRAINT `PlanningActivity_planningId_fkey` FOREIGN KEY (`planningId`) REFERENCES `Planning`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlanningActivity` ADD CONSTRAINT `PlanningActivity_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Feedback` ADD CONSTRAINT `Feedback_planningId_fkey` FOREIGN KEY (`planningId`) REFERENCES `PlanningActivity`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
