/*
  Warnings:

  - You are about to drop the column `comletedAt` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `dueDate` on the `Todo` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Todo_dueDate_idx";

-- AlterTable
ALTER TABLE "Todo" DROP COLUMN "comletedAt",
DROP COLUMN "dueDate";
