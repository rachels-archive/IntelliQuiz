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

    const quiz = await prisma.quiz.findUnique({ where: { id: quizId }, include: { questions: true } });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const score = (correctAnswers / quiz.questions.length) * 100;

    const updatedQuiz = await prisma.quiz.update({
      where: { id: quizId },
      data: {
        timeStarted: new Date(timeStarted),
        timeEnded: new Date(timeEnded),
        latestScore: score,
      },
    });

    return NextResponse.json({ success: true, quiz: updatedQuiz });
  } catch (error) {
    console.error("Error completing quiz:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
