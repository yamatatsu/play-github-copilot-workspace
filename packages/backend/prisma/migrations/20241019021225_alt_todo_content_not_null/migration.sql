/*
  Warnings:

  - Made the column `content` on table `Todo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Todo` MODIFY `content` VARCHAR(191) NOT NULL;
