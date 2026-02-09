export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    console.log(
      "[📊 OpenTelemetry] Inicializando instrumentação do servidor...",
    );

    try {

      const { startCleanupScheduler } =
        await import("./lib/services/quiz-users-improved");

      console.log("[🧹 Cleanup] Iniciando scheduler...");
      startCleanupScheduler(15 * 60 * 1000);

      console.log("[✅ Instrumentação] Servidor inicializado com sucesso!");
    } catch (error) {
      console.error(
        "[❌ Instrumentação] Erro ao inicializar servidor:",
        error instanceof Error ? error.message : String(error),
      );
    }
  }
}
