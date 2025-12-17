/*
  Warnings:

  - You are about to drop the column `ecoleId` on the `child` table. All the data in the column will be lost.
  - Added the required column `schoolId` to the `Child` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `child` DROP FOREIGN KEY `Child_ecoleId_fkey`;

-- DropIndex
DROP INDEX `Child_ecoleId_fkey` ON `child`;

-- AlterTable
ALTER TABLE `child` DROP COLUMN `ecoleId`,
    ADD COLUMN `schoolId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `status` ENUM('NOT_CONFIRMED', 'CONFIRMED', 'DEACTIVATED', 'BANNED') NOT NULL DEFAULT 'NOT_CONFIRMED';

-- AddForeignKey
ALTER TABLE `Child` ADD CONSTRAINT `Child_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `School`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
