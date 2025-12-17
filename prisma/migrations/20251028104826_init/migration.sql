/*
  Warnings:

  - You are about to drop the `ecole` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `child` DROP FOREIGN KEY `Child_ecoleId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_ecoleId_fkey`;

-- DropIndex
DROP INDEX `Child_ecoleId_fkey` ON `child`;

-- DropIndex
DROP INDEX `User_ecoleId_fkey` ON `user`;

-- DropTable
DROP TABLE `ecole`;

-- CreateTable
CREATE TABLE `School` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `address` VARCHAR(200) NOT NULL,
    `postalCode` INTEGER NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `type` ENUM('PRIMAIRE', 'MATERNELLE', 'PRIMAIRE_MATENELLE') NOT NULL DEFAULT 'PRIMAIRE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_ecoleId_fkey` FOREIGN KEY (`ecoleId`) REFERENCES `School`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Child` ADD CONSTRAINT `Child_ecoleId_fkey` FOREIGN KEY (`ecoleId`) REFERENCES `School`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
