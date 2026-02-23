/*
  Warnings:

  - You are about to drop the column `questionStartedAt` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `started` on the `Question` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "questionStartedAt",
DROP COLUMN "started",
ALTER COLUMN "duration" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "questionStartedAt" TIMESTAMP(3);
