import { NextRequest, NextResponse } from "next/server";
import { getQuestionMonitoringData } from "./services/index.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; questionId: string }> },
): Promise<NextResponse> {
  try {
    const { id: quizId, questionId } = await params;

    const monitoringData = await getQuestionMonitoringData(quizId, questionId);

    return NextResponse.json(
      {
        success: monitoringData.success,
        data: monitoringData.data,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erro ao buscar monitoramento:", error);

    return NextResponse.json(
      { success: false, error: "Erro ao processar dados" },
      { status: 500 },
    );
  }
}
