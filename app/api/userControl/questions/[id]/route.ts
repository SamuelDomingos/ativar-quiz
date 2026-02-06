import { NextRequest, NextResponse } from "next/server";
import { markAnswerService } from "../../services/markAnswer.service";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: idQuestion } = await params;
    const body = await request.json();
    const { sessionId, optionId } = body;

    const result = await markAnswerService.markAnswer(
      sessionId,
      idQuestion,
      optionId,
    );

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (erro) {
    console.error("Erro ao controlar quiz:", erro);
    return NextResponse.json(
      { error: "Erro ao processar dados" },
      { status: 500 },
    );
  }
}
