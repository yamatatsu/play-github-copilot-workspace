/*
  Warnings:

  - You are about to drop the column `authorId` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `createdBy` to the `Todo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Todo` DROP FOREIGN KEY `Todo_authorId_fkey`;

-- AlterTable
ALTER TABLE `Todo` DROP COLUMN `authorId`,
    ADD COLUMN `createdBy` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `User`;

-- CreateIndex
CREATE INDEX `Todo_createdBy_idx` ON `Todo`(`createdBy`);
