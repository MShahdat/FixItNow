/*
  Warnings:

  - You are about to drop the column `compoletedJobs` on the `technician_profiles` table. All the data in the column will be lost.
  - Made the column `hourlyRate` on table `technician_profiles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `avgRating` on table `technician_profiles` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "technician_profiles" DROP COLUMN "compoletedJobs",
ADD COLUMN     "completedJobs" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "hourlyRate" SET NOT NULL,
ALTER COLUMN "avgRating" SET NOT NULL;
