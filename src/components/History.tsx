import prisma from "@/lib/db";
import { ClipboardEdit, Clock, CopyCheck, Trash } from "lucide-react";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import React from "react";
import QuizCard from "./history/QuizCard";

type Props = { userId: number };

const History = async ({ userId }: Props) => {
  const quizzes = await prisma.quiz.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-8 w-full">
      {quizzes.map((quiz) => (
        <QuizCard key={quiz.id} quiz={quiz} />
      ))}
    </div>
  );
};

export default History;
