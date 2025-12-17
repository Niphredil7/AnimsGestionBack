/*
  Warnings:

  - You are about to drop the `classhasplanning` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `classhasplanning` DROP FOREIGN KEY `ClassHasPlanning_classId_fkey`;

-- DropForeignKey
ALTER TABLE `classhasplanning` DROP FOREIGN KEY `ClassHasPlanning_planningId_fkey`;

-- DropTable
DROP TABLE `classhasplanning`;

-- CreateTable
CREATE TABLE `_ClassToPlanning` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ClassToPlanning_AB_unique`(`A`, `B`),
    INDEX `_ClassToPlanning_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ClassToPlanning` ADD CONSTRAINT `_ClassToPlanning_A_fkey` FOREIGN KEY (`A`) REFERENCES `Class`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ClassToPlanning` ADD CONSTRAINT `_ClassToPlanning_B_fkey` FOREIGN KEY (`B`) REFERENCES `Planning`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
