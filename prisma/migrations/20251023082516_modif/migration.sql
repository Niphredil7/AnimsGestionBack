/*
  Warnings:

  - You are about to drop the column `dateSart` on the `planning` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Ecole` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateStart` to the `Planning` table without a default value. This is not possible if the table is not empty.
  - Made the column `city` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `ecole` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `event` MODIFY `type` ENUM('RDV', 'REUNION') NOT NULL DEFAULT 'REUNION';

-- AlterTable
ALTER TABLE `planning` DROP COLUMN `dateSart`,
    ADD COLUMN `dateStart` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `photo` VARCHAR(191) NULL,
    MODIFY `city` VARCHAR(100) NOT NULL,
    MODIFY `cv` TEXT NULL;
