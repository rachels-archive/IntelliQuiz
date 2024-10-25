import QuizForm from "@/components/form/QuizForm";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Quiz | IntelliQuiz",
};

const page = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <QuizForm />
    </div>
  );
};

export default page;
