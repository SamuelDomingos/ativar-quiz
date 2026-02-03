"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useParams } from "next/navigation";
import { useVerifyQuiz } from "@/app/quiz/[id]/_hooks/useVerification";
import QrCode from "@/components/qrCode";

interface WaitingScreenProps {
  quizTitle: string;
  quizDescription: string;
  participantsCount: number;
}

export default function WaitingScreenPage({
  quizTitle,
  quizDescription,
  participantsCount,
}: WaitingScreenProps) {
  const params = useParams();
  const id = params.id as string;

  const { isLoading, isFetching } = useVerifyQuiz(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-background via-background to-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Spinner className="w-16 h-16 mx-auto" />
          <p className="text-muted-foreground">Carregando quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-background flex items-center justify-center">
      <div className="max-w-6xl w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <QrCode id={id} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <Card className="border-border shadow-2xl w-full max-w-sm">
              <CardHeader className="space-y-4 text-center pb-8">
                <div className="flex justify-center">
                  <Spinner className="w-16 h-16" />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-2xl font-bold">
                    {quizTitle}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {quizDescription}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30"
                  >
                    <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                    <span className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">
                      Aguardando começar...
                    </span>
                  </motion.div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">
                    Participantes
                  </h3>
                  <div className="p-6 rounded-lg bg-secondary/50 border border-border">
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 100 }}
                      className="text-center"
                    >
                      <p className="text-4xl font-bold text-foreground">
                        {participantsCount}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        pessoa{participantsCount !== 1 ? "s" : ""} aguardando
                      </p>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
