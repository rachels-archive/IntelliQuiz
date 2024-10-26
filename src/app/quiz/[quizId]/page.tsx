import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import prisma from "@/lib/db";
import QuizCard from "@/components/QuizCard";

export const metadata = {
  title: "Playing Quiz...",
};

type Props = {
  params: {
    quizId: string;
  };
};

const page = async ({ params: { quizId } }: Props) => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect("/");
  }

  const quiz = await prisma.quiz.findUnique({
    where: {
      id: quizId,
    },
    include: {
      questions: {
        select: {
          id: true,
          question: true,
          options: true,
        },
      },
    },
  });

  if (!quiz) {
    return redirect("/generate-quiz");
  }

  return <QuizCard quiz={quiz} />;
};

export default page;
