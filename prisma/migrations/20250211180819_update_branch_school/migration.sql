/*
  Warnings:

  - You are about to drop the column `address` on the `Student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[father_phone]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `branch` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "address",
ADD COLUMN     "branch" TEXT NOT NULL,
ADD COLUMN     "father_phone" TEXT,
ADD COLUMN     "mother_phone" TEXT,
ALTER COLUMN "phone" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Student_father_phone_key" ON "Student"("father_phone");
