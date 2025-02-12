/*
  Warnings:

  - You are about to drop the column `billerReferenceNumber` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `schoolId` on the `Student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[referenceNumber]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[transactionNumber]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `parentPhone` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referenceNumber` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionNumber` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_schoolId_fkey";

-- DropIndex
DROP INDEX "Order_billerReferenceNumber_key";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "billerReferenceNumber",
DROP COLUMN "itemId",
DROP COLUMN "quantity",
ADD COLUMN     "parentPhone" TEXT NOT NULL,
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "referenceNumber" TEXT NOT NULL,
ADD COLUMN     "transactionNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "schoolId";

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "billerReferenceNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_billerReferenceNumber_key" ON "Product"("billerReferenceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Order_referenceNumber_key" ON "Order"("referenceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Order_transactionNumber_key" ON "Order"("transactionNumber");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
