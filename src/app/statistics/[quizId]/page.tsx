import AccuracyCard from "@/components/statistics/AccuracyCard";
import QuestionList from "@/components/statistics/QuestionList";
import ResultsCard from "@/components/statistics/ResultsCard";
import TimeTakenCard from "@/components/statistics/TimeTakenCard";
import { buttonVariants } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { LucideLayoutDashboard } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    quizId: string;
  };
};

const Statistics = async ({ params: { quizId } }: Props) => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/");
  }

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { questions: true },
  });

  if (!quiz) {
    redirect("/generate-quiz");
  }

  let accuracy: number = 0;

  let totalCorrect = quiz.questions.reduce((acc, question) => {
    if (question.isCorrect) {
      return acc + 1;
    }
    return acc;
  }, 0);

  accuracy = Math.round((totalCorrect / quiz.questions.length) * 100 * 100) / 100;

  return (
    <>
      <div className="p-8 mx-auto w-full">
        <div className="flex items-center justify-between space-y-2">
          <h3 className="text-3xl font-bold tracking-tight">Statistics</h3>
          <div className="flex items-center space-x-2">
            <Link href="/dashboard" className={buttonVariants()}>
              Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-7">
          <ResultsCard accuracy={accuracy} />
          <AccuracyCard accuracy={accuracy} />
          <TimeTakenCard timeStarted={quiz.timeStarted} timeEnded={quiz.timeEnded} />
        </div>

        <QuestionList questions={quiz.questions} />
      </div>
    </>
  );
};

export default Statistics;
