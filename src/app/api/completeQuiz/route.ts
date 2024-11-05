// app/api/completeQuiz/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { quizId, timeStarted, timeEnded, correctAnswers, totalQuestions } = body;

    const updatedQuiz = await prisma.quiz.update({
      where: { id: quizId },
      data: {
        timeStarted: new Date(timeStarted),
        timeEnded: new Date(timeEnded),
      },
    });

    return NextResponse.json({ success: true, quiz: updatedQuiz });
  } catch (error) {
    console.error("Error completing quiz:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
