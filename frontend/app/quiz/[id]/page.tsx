"use client";
import { Spinner } from "@/components/ui/spinner";
import { useParams } from "next/navigation";
import { useVerifyQuiz } from "@/app/quiz/[id]/_hooks/useVerification";
import WaitingScreen from "./_screen/wait/page";
import ParticipantQuizPage from "./_screen/started/page";

export default function WaitingScreenPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading } = useVerifyQuiz(id);

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

  if (data?.quizStatus === "WAITING")
    return <WaitingScreen id={id} totalParticipants={data.totalParticipants} />;
  if (data?.quizStatus === "STARTED") return <ParticipantQuizPage />;
}
