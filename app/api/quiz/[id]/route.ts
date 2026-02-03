import { NextResponse } from "next/server";

export async function GET() {
  try {
    // const result = await quizService.getById();
    // if (result.success) {
    //   return NextResponse.json(result.data, { status: 201 });
    // } else {
    //   return NextResponse.json({ error: result.error }, { status: 400 });
    // }
    return NextResponse.json({ message: 123 }, { status: 200 });
  } catch (erro) {
    console.error("Erro ao processar dados:", erro);
    return NextResponse.json(
      { error: "Erro ao processar dados" },
      { status: 500 },
    );
  }
}