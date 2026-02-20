-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "questionStartedAt" TIMESTAMP(3),
ADD COLUMN     "started" BOOLEAN NOT NULL DEFAULT false;
