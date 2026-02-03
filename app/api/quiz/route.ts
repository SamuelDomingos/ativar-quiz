"use server";

import { NextRequest, NextResponse } from "next/server";
import { quizService } from "./services/index.service";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    const result = await quizService.post(formData);

    if (result.success) {
      return NextResponse.json(result.data, { status: 201 });
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (erro) {
    console.error("Erro ao processar dados:", erro);
    return NextResponse.json(
      { error: "Erro ao processar dados" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const result = await quizService.getAll();
    if (result.success) {
      return NextResponse.json(result.data, { status: 201 });
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (erro) {
    console.error("Erro ao processar dados:", erro);
    return NextResponse.json(
      { error: "Erro ao processar dados" },
      { status: 500 },
    );
  }
}
