// app/page.tsx
import { authOptions } from "@/lib/auth";
import { url } from "inspector";
import { ArrowBigRight, ArrowRight, User } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/sign-in"); // Use redirect correctly
  }

  return (
    <div className="m-auto">
      <h1 className="text-4xl text-center font-bold mb-2">Welcome to IntelliQuiz 🚀</h1>

      {/* How to Play Info Box */}
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">How to Play</h2>
        <p className="text-lg text-gray-600 mb-4">
          Welcome to your personalized quiz platform! Here&apos;s how you can start making the most of your learning:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-600">
          <li>
            <strong>Generate Quiz:</strong> Click on &quot;Generate Quiz&quot; to create a new quiz by simply typing in
            text or uploading your PDF notes.
          </li>
          <li>
            <strong>Quiz History:</strong> View your previously created quizzes and see all the questions you&apos;ve
            tackled. You can also retry quizzes to improve your scores!
          </li>
          <li>
            <strong>Track Your Progress:</strong> The Dashboard helps you track your quiz scores and monitor your
            progress over time.
          </li>
          <li>
            <strong>Review Questions:</strong> After taking a quiz, you can review the questions as part of your
            revision process.
          </li>
        </ul>
        <Link
          href="/dashboard"
          className="inline-flex gap-3 mt-3 items-center justify-center rounded-md text-xl font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 px-7 py-3"
        >
          Start Learning
          <ArrowRight />
        </Link>
      </div>
    </div>
  );
}
