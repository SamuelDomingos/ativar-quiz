import { Badge } from "@/components/ui/badge";

const HeaderStarted = ({
  monitoringData,
  currentQuestion,
}: {
  monitoringData: any;
  currentQuestion: any;
}) => {
  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quiz</h1>
          <p className="text-muted-foreground mt-1">
            Participantes: {monitoringData?.data?.totalParticipants}
          </p>
        </div>
        <Badge variant="outline" className="text-base px-4 py-2">
          Questão {currentQuestion.order}
        </Badge>
      </div>
    </div>
  );
};

export default HeaderStarted;
