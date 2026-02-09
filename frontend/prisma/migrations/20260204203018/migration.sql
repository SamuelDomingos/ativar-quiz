-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "currentQuestionId" TEXT,
ADD COLUMN     "questionStartedAt" TIMESTAMP(3);
