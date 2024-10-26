import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { error } from "console";

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();

    const { questionId, userAnswer } = body;

    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return NextResponse.json({ error: "Question Not Found" }, { status: 404 });
    }

    await prisma.question.update({
      where: { id: questionId },
      data: {
        userAnswer,
      },
    });

    const isCorrect = question.answer.toLowerCase().trim() === userAnswer.toLowerCase().trim();

    await prisma.question.update({
      where: { id: questionId },
      data: {
        isCorrect,
      },
    });

    return NextResponse.json({ isCorrect }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }
}
