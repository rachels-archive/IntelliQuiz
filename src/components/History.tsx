import prisma from "@/lib/db";
import { ClipboardEdit, Clock, CopyCheck } from "lucide-react";
import Link from "next/link";
import React from "react";

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
    <div className="space-y-8 w-full ">
      {quizzes.map((quiz) => {
        return (
          <div
            className="flex items-center  bg-white w-3/4 mx-auto p-5 rounded-lg border border-[#57463E]"
            key={quiz.id}
          >
            <div className="flex items-center justify-between w-full">
              <div className="ml-4 space-y-2">
                <p className="text-base text-xl font-bold leading-none mb-3">{quiz.title}</p>
                <p className="flex items-center text-sm">
                  <Clock className="w-4 h-4 mr-1" /> Created On: &nbsp;
                  {new Date(quiz.createdAt ?? 0).toLocaleDateString()}
                </p>
                <p className="flex items-center text-sm">
                  <ClipboardEdit className="w-4 h-4 mr-1" /> Latest Score: &nbsp;
                  {quiz.latestScore}%
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Link href={`/statistics/${quiz.id}`}>
                  <button className="text-md w-full font-semibold bg-[#57463E] px-5 py-2 rounded-lg text-white">
                    Review Questions
                  </button>
                </Link>
                <Link href={`/statistics/${quiz.id}`}>
                  <button className="text-md w-full font-semibold bg-[#57463E] px-5 py-2 rounded-lg text-white">
                    Retry Quiz
                  </button>
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default History;
