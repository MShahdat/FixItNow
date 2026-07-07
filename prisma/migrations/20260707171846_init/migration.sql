/*
  Warnings:

  - You are about to alter the column `amount` on the `payments` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - The `experience` column on the `technician_profiles` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `avgRating` on the `technician_profiles` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(3,2)`.
  - Made the column `paidAt` on table `payments` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "payments_userId_key";

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "paidAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "technician_profiles" DROP COLUMN "experience",
ADD COLUMN     "experience" INTEGER,
ALTER COLUMN "hourlyRate" SET DEFAULT 0,
ALTER COLUMN "avgRating" SET DATA TYPE DECIMAL(3,2);

-- CreateIndex
CREATE INDEX "bookings_customerId_idx" ON "bookings"("customerId");

-- CreateIndex
CREATE INDEX "bookings_technicianId_idx" ON "bookings"("technicianId");

-- CreateIndex
CREATE INDEX "bookings_serviceId_idx" ON "bookings"("serviceId");

-- CreateIndex
CREATE INDEX "payments_bookingId_idx" ON "payments"("bookingId");

-- CreateIndex
CREATE INDEX "payments_userId_idx" ON "payments"("userId");

-- CreateIndex
CREATE INDEX "reviews_bookingId_idx" ON "reviews"("bookingId");

-- CreateIndex
CREATE INDEX "reviews_customerId_idx" ON "reviews"("customerId");

-- CreateIndex
CREATE INDEX "reviews_technicianId_idx" ON "reviews"("technicianId");

-- CreateIndex
CREATE INDEX "services_technicianProfileId_idx" ON "services"("technicianProfileId");

-- CreateIndex
CREATE INDEX "services_categoryId_idx" ON "services"("categoryId");
