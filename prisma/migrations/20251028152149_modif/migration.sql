/*
  Warnings:

  - The values [IsDisliked] on the enum `Feedback_status` will be removed. If these variants are still used in the database, this will fail.
  - The values [IsDisliked] on the enum `Feedback_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `categoryhasmaterial` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `categoryhasmaterial` DROP FOREIGN KEY `CategoryHasMaterial_categoryMaterialId_fkey`;

-- DropForeignKey
ALTER TABLE `categoryhasmaterial` DROP FOREIGN KEY `CategoryHasMaterial_materialId_fkey`;

-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `Notification_activityOutingId_fkey`;

-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `Notification_happenningId_fkey`;

-- DropIndex
DROP INDEX `Notification_activityOutingId_fkey` ON `notification`;

-- DropIndex
DROP INDEX `Notification_happenningId_fkey` ON `notification`;

-- AlterTable
ALTER TABLE `activityouting` MODIFY `favorite` ENUM('IsNotFavorite', 'IsFavorite') NOT NULL DEFAULT 'IsNotFavorite';

-- AlterTable
ALTER TABLE `feedback` MODIFY `status` ENUM('IsNotFavorite', 'IsFavorite') NOT NULL DEFAULT 'IsNotFavorite';

-- AlterTable
ALTER TABLE `notification` MODIFY `activityOutingId` VARCHAR(191) NULL,
    MODIFY `happenningId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `categoryhasmaterial`;

-- CreateTable
CREATE TABLE `_CategoryMaterialToMaterial` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_CategoryMaterialToMaterial_AB_unique`(`A`, `B`),
    INDEX `_CategoryMaterialToMaterial_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_activityOutingId_fkey` FOREIGN KEY (`activityOutingId`) REFERENCES `ActivityOuting`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_happenningId_fkey` FOREIGN KEY (`happenningId`) REFERENCES `Happenning`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CategoryMaterialToMaterial` ADD CONSTRAINT `_CategoryMaterialToMaterial_A_fkey` FOREIGN KEY (`A`) REFERENCES `CategoryMaterial`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CategoryMaterialToMaterial` ADD CONSTRAINT `_CategoryMaterialToMaterial_B_fkey` FOREIGN KEY (`B`) REFERENCES `Material`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
