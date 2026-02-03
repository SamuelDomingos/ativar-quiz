import { NextRequest, NextResponse } from "next/server";
import { quizService } from "./services/index.service";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    const result = await quizService(formData);

    if (result.success) {
      return NextResponse.json(result.data, { status: 201 });
    } else {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }
  } catch (erro) {
    console.error("Erro ao processar dados:", erro);
    return NextResponse.json(
      { error: "Erro ao processar dados" },
      { status: 500 },
    );
  }
}
