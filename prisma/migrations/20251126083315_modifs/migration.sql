/*
  Warnings:

  - You are about to drop the column `validatedAt` on the `activity` table. All the data in the column will be lost.
  - You are about to drop the column `validatedAt` on the `outing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `activity` DROP COLUMN `validatedAt`;

-- AlterTable
ALTER TABLE `outing` DROP COLUMN `validatedAt`;
