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
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-border shadow-2xl">
          <CardHeader className="space-y-2 text-center pb-8">
            <Spinner className="w-16 h-16 mx-auto" />
            <div className="space-y-2">
              <CardTitle className="text-2xl">{quizTitle}</CardTitle>
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
                <span className="text-sm text-yellow-700 dark:text-yellow-300">
                  Aguardando comecar...
                </span>
              </motion.div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">
                Participantes
              </h3>
              <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-center"
                >
                  <p className="text-3xl font-bold text-foreground">
                    {participantsCount}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    pessoa{participantsCount !== 1 ? "s" : ""} aguardando
                  </p>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
