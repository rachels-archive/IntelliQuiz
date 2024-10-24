import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Dashboard | IntelliQuiz",
};

const page = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/"); // Use redirect correctly
  }

  return (
    <div className="w-full mt-14 p-4">
      <h2 className="text-2xl font-bold">{session?.user.username}&rsquo;s Dashboard</h2>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="bg-white rounded-lg shadow-md py-12 text-center">
          <h3 className="font-semibold">x</h3>
          <p>Quizzes Completed</p>
        </div>
        <div className="bg-white rounded-lg shadow-md py-12 text-center">
          <h3 className="font-semibold">x</h3>
          <p>Average Score</p>
        </div>
        <div className="bg-white rounded-lg shadow-md py-12 text-center">
          <h3 className="font-semibold">x</h3>
          <p>Badges Earned</p>
        </div>
      </div>
    </div>
  );
};

export default page;
