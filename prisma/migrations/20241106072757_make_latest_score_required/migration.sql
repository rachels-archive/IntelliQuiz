/*
  Warnings:

  - Made the column `latestScore` on table `Quiz` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Quiz" ALTER COLUMN "latestScore" SET NOT NULL,
ALTER COLUMN "latestScore" SET DEFAULT 0,
ALTER COLUMN "latestScore" SET DATA TYPE DOUBLE PRECISION;
-- Add a step to update existing NULL values to a default value (e.g., 0)
