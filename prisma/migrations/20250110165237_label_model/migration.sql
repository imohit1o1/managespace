/*
  Warnings:

  - You are about to drop the `Todo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_LabelToTodo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Todo" DROP CONSTRAINT "Todo_userId_fkey";

-- DropForeignKey
ALTER TABLE "_LabelToTodo" DROP CONSTRAINT "_LabelToTodo_A_fkey";

-- DropForeignKey
ALTER TABLE "_LabelToTodo" DROP CONSTRAINT "_LabelToTodo_B_fkey";

-- AlterTable
ALTER TABLE "Label" ADD COLUMN     "userId" TEXT;

-- DropTable
DROP TABLE "Todo";

-- DropTable
DROP TABLE "_LabelToTodo";

-- AddForeignKey
ALTER TABLE "Label" ADD CONSTRAINT "Label_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
