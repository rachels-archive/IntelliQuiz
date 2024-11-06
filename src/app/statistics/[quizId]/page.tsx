import ScoreCard from "@/components/statistics/ScoreCard";
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

  return (
    <>
      <div className="p-8 mx-auto w-full">
        <div className="flex items-center justify-between space-y-2 mb-3">
          <h3 className="text-3xl font-bold tracking-tight">Statistics</h3>
          <div className="flex items-center space-x-2">
            <Link href="/quiz-history" className={buttonVariants()}>
              Back to Quiz History
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-7">
          <ResultsCard score={quiz.latestScore} />
          <ScoreCard score={quiz.latestScore} />
          <TimeTakenCard timeStarted={quiz.timeStarted} timeEnded={quiz.timeEnded} />
        </div>

        <QuestionList questions={quiz.questions} />
      </div>
    </>
  );
};

export default Statistics;
