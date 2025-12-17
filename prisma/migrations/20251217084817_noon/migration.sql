/*
  Warnings:

  - The values [MIDI] on the enum `PlanningActivity_moment` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `planningactivity` MODIFY `moment` ENUM('MORNING', 'NOON', 'EVENING') NOT NULL;
