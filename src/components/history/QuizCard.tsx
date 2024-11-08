// components/QuizCard.tsx
"use client";

import { ClipboardEdit, Clock, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type QuizCardProps = {
  quiz: {
    id: string;
    title: string;
    createdAt: Date | null;
    latestScore: number;
  };
};

const QuizCard = ({ quiz }: QuizCardProps) => {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this quiz?");
    if (!confirmed) return; // Exit if user cancels

    try {
      await fetch(`/api/quiz/${quiz.id}`, {
        method: "DELETE",
      });
      alert("Quiz successfully deleted!"); //
      router.refresh();
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  return (
    <div className="flex items-center bg-white w-3/4 mx-auto p-5 rounded-lg border border-[#57463E]">
      <div className="flex items-center justify-between w-full">
        <div className="ml-4 space-y-2">
          <p className="text-base text-xl font-bold leading-none mb-3">{quiz.title}</p>
          <p className="flex items-center text-sm">
            <Clock className="w-4 h-4 mr-1" /> Created On: &nbsp;
            {new Date(quiz.createdAt ?? 0).toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </p>

          <p className="flex items-center text-sm">
            <ClipboardEdit className="w-4 h-4 mr-1" /> Latest Score: &nbsp;
            {quiz.latestScore}%
          </p>
          <button
            className="text-sm font-semibold bg-red-200 hover:bg-red-300 px-3 py-2 rounded-lg"
            onClick={handleDelete}
          >
            <span className="flex items-center gap-2">
              <Trash className="text-xs" size={16} />
              <p>Delete Quiz</p>
            </span>
          </button>
        </div>
        <div className="flex flex-col gap-3">
          <Link href={`/statistics/${quiz.id}`}>
            <button className="text-md w-full font-semibold bg-[#57463E] px-5 py-2 rounded-lg text-white">
              Review Questions
            </button>
          </Link>
          <Link href={`/quiz/${quiz.id}`}>
            <button className="text-md w-full font-semibold bg-[#57463E] px-5 py-2 rounded-lg text-white">
              Retry Quiz
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
