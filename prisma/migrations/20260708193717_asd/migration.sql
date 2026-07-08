/*
  Warnings:

  - You are about to drop the column `rating` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `avgRating` on the `technician_profiles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[serviceId]` on the table `bookings` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "services" DROP COLUMN "rating";

-- AlterTable
ALTER TABLE "technician_profiles" DROP COLUMN "avgRating";

-- CreateIndex
CREATE UNIQUE INDEX "bookings_serviceId_key" ON "bookings"("serviceId");

-- CreateIndex
CREATE INDEX "reviews_serviceId_idx" ON "reviews"("serviceId");
