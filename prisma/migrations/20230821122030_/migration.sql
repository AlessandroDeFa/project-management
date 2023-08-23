/*
  Warnings:

  - You are about to drop the column `DueDate` on the `Memo` table. All the data in the column will be lost.
  - Added the required column `dueDate` to the `Memo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Memo" DROP COLUMN "DueDate",
ADD COLUMN     "dueDate" TEXT NOT NULL;
