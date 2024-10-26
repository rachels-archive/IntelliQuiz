import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import prisma from "@/lib/db";

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
      questions: true,
    },
  });

  return <pre>{JSON.stringify(quiz, null, 2)}</pre>;
};

export default page;
