// app/api/quiz/[id]/control/route.ts
import { NextRequest, NextResponse } from "next/server";
import { quizControlService } from "../../services/quizControl.service";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const idQuiz = params.id;
    const body = await request.json();
    const { action } = body;

    if (!idQuiz) {
      return NextResponse.json(
        { error: "ID do quiz é obrigatório" },
        { status: 400 }
      );
    }

    if (!action) {
      return NextResponse.json(
        { error: "Ação é obrigatória" },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case "start":
        result = await quizControlService.startQuiz(idQuiz);
        break;

      case "next":
        result = await quizControlService.nextQuestion(idQuiz);
        break;

      default:
        return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
    }

    if (result.success) {
      return NextResponse.json(result.data, { status: 200 });
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (erro) {
    console.error("Erro ao controlar quiz:", erro);
    return NextResponse.json(
      { error: "Erro ao processar dados" },
      { status: 500 }
    );
  }
}