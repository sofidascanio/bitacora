/*
  Warnings:

  - You are about to drop the column `userId` on the `ExpenseCategory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `ExpenseCategory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,userId]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ExpenseCategory" DROP CONSTRAINT "ExpenseCategory_userId_fkey";

-- DropIndex
DROP INDEX "ExpenseCategory_name_userId_key";

-- DropIndex
DROP INDEX "Tag_name_key";

-- AlterTable
ALTER TABLE "ExpenseCategory" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ExpenseCategory_name_key" ON "ExpenseCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_userId_key" ON "Tag"("name", "userId");

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
