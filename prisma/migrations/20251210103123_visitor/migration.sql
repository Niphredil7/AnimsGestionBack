/*
  Warnings:

  - You are about to drop the column `ecoleId` on the `user` table. All the data in the column will be lost.
  - You are about to alter the column `role` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(13))` to `Enum(EnumId(4))`.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_ecoleId_fkey`;

-- DropIndex
DROP INDEX `User_ecoleId_fkey` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `ecoleId`,
    ADD COLUMN `schoolId` VARCHAR(191) NULL,
    MODIFY `role` ENUM('COORDO', 'ANIMATOR', 'VISITOR', 'PARENT', 'ANIMATOR_PARENT') NOT NULL DEFAULT 'VISITOR';

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `School`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
