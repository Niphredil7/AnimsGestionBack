/*
  Warnings:

  - You are about to drop the column `availability` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `availability`,
    DROP COLUMN `postalCode`,
    ADD COLUMN `available` VARCHAR(200) NULL,
    ADD COLUMN `zipCode` INTEGER NULL;
