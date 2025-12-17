/*
  Warnings:

  - You are about to alter the column `address` on the `school` table. The data in that column could be lost. The data in that column will be cast from `VarChar(200)` to `VarChar(191)`.
  - The values [PRIMAIRE_MATENELLE] on the enum `School_type` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[address]` on the table `School` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `school` MODIFY `address` VARCHAR(191) NOT NULL,
    MODIFY `type` ENUM('PRIMAIRE', 'MATERNELLE', 'PRIMAIRE_MATERNELLE') NOT NULL DEFAULT 'PRIMAIRE';

-- CreateIndex
CREATE UNIQUE INDEX `School_address_key` ON `School`(`address`);
