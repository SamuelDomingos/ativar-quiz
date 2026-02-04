import { NextRequest, NextResponse } from "next/server";
import { joinQuizService, validateQuizAccess } from "./services/index.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idQuiz, userName } = body;

    const result = await joinQuizService({
      idQuiz,
      userName,
    });

    if (result.success) {
      return NextResponse.json(result, { status: 201 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error("Erro ao processar entrada no quiz:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao processar sua entrada no quiz",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const idQuiz = searchParams.get("idQuiz");

    if (!idQuiz) {
      return NextResponse.json(
        {
          success: false,
          message: "idQuiz é obrigatório",
          timestamp: new Date().toISOString(),
        },
        { status: 400 },
      );
    }

    const result = await validateQuizAccess(idQuiz);

    return NextResponse.json(result, {
      status: 200,
    });
  } catch (error) {
    console.error("Erro ao validar acesso ao quiz:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao validar acesso ao quiz",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
