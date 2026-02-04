import { NextRequest, NextResponse } from "next/server";
import { quizService } from "../../services/index.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const result = await quizService.getStatus(id);

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (erro) {
    console.error("Erro:", erro);
    return NextResponse.json(
      { error: "Erro ao processar dados" },
      { status: 500 },
    );
  }
}
