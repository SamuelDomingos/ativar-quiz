import { prisma } from "@/lib/prisma";

const cleanupInactiveSessions = async (): Promise<number> => {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const inactiveSessions = await prisma.quizSession.findMany({
      where: {
        joinedAt: {
          lt: oneHourAgo,
        },
      },
      select: {
        id: true,
        userName: true,
        joinedAt: true,
        _count: {
          select: { answers: true },
        },
      },
    });

    if (inactiveSessions.length === 0) {
      return 0;
    }

    const deletedSessions = await prisma.quizSession.deleteMany({
      where: {
        joinedAt: {
          lt: oneHourAgo,
        },
        answers: {
          none: {
            answeredAt: {
              gt: oneHourAgo,
            },
          },
        },
      },
    });

    return deletedSessions.count;
  } catch (error) {
    console.error("[Cleanup] Erro ao limpar sessões inativas:", error);
    return 0;
  }
};

export const startCleanupScheduler = (intervalMs: number = 15 * 60 * 1000) => {
  cleanupInactiveSessions();

  const intervalId = setInterval(async () => {
    try {
      const deletedCount = await cleanupInactiveSessions();
      if (deletedCount > 0) {
        console.log(`[Cleanup] ✅ ${deletedCount} sessão(ões) removida(s)`);
      }
    } catch (error) {
      console.error("[Cleanup] ❌ Erro durante limpeza agendada:", error);
    }
  }, intervalMs);

  return () => {
    clearInterval(intervalId);
    console.log("[Cleanup] ⏹️  Scheduler parado");
  };
};
