import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { Edit, Medal, Pencil } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Dashboard | IntelliQuiz",
};

const page = async () => {
  const session = await getServerSession(authOptions);

  console.log("Cirrent uyser", session?.user);
  if (!session?.user) {
    redirect("/");
  }

  const userQuizzes = await prisma.quiz.findMany({
    where: { userId: parseInt(session.user.id) },
    select: { latestScore: true },
  });

  const quizzesCount = userQuizzes.length;
  const goldBadges = userQuizzes.filter((quiz) => quiz.latestScore >= 75).length;
  const silverBadges = userQuizzes.filter((quiz) => quiz.latestScore >= 50 && quiz.latestScore < 75).length;
  const bronzeBadges = userQuizzes.filter((quiz) => quiz.latestScore < 50).length;

  return (
    <div className="w-full my-auto">
      <div className="w-4/5 mx-auto bg-white rounded-lg p-6">
        <h2 className="text-3xl font-bold  text-center mb-5">{session?.user.username}&rsquo;s Dashboard</h2>
        <div className="flex flex-row justify-between space-x-3 mb-6">
          <Link href="/generate-quiz" className="flex-grow">
            <button className="border border-gray-300 hover:bg-gray-300 w-full rounded-lg shadow-md py-4 font-semibold text-center">
              Generate Quiz
            </button>
          </Link>
          <Link href="/quiz-history" className="flex-grow">
            <button className="border border-gray-300 hover:bg-gray-300 w-full rounded-lg shadow-md py-4 font-semibold text-center">
              View Quiz History
            </button>
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-4 ">
          <div className="bg-white rounded-lg shadow-md py-16 text-center border-gray-300 border relative">
            <Pencil size={40} color="#FFD700" className="absolute top-4 left-4" />
            <div className="my-auto">
              <h3 className="font-semibold text-4xl">{quizzesCount}</h3>
              <p className="text-2xl">Quizzes Created</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md py-16 text-center border-gray-300 border relative">
            <Medal size={40} color="#FFD700" className="absolute top-4 left-4" />
            <div className="my-auto">
              <h3 className="font-semibold text-4xl">{goldBadges}</h3>
              <p className="text-2xl">Gold Badges</p>
              <p className="text-slate-400 text-sm">{"75% and higher"}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md py-16 text-center border-gray-300 border relative">
            <Medal size={40} color="#C0C0C0" className="absolute top-4 left-4" />
            <div className="my-auto">
              <h3 className="font-semibold text-4xl">{silverBadges}</h3>
              <p className="text-2xl">Silver Badges</p>
              <p className="text-slate-400 text-sm">{"50% and higher"}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md py-16 text-center border-gray-300 border relative">
            <Medal size={40} color="#CD7F32" className="absolute top-4 left-4" />
            <div className="my-auto">
              <h3 className="font-semibold text-4xl">{bronzeBadges}</h3>
              <p className="text-2xl">Bronze Badges</p>
              <p className="text-slate-400 text-sm">{"Between 0% and 49%"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
