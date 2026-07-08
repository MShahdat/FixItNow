/*
  Warnings:

  - You are about to drop the column `bookingId` on the `reviews` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[serviceId]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `serviceId` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_bookingId_fkey";

-- DropIndex
DROP INDEX "reviews_bookingId_idx";

-- DropIndex
DROP INDEX "reviews_bookingId_key";

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "bookingId",
ADD COLUMN     "serviceId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "reviews_serviceId_key" ON "reviews"("serviceId");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
