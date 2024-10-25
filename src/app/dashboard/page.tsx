import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Dashboard | IntelliQuiz",
};

const page = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="w-full mt-14 p-8">
      <h2 className="text-2xl font-bold">{session?.user.username}&rsquo;s Dashboard</h2>

      <div className="grid grid-cols-3 gap-4 mt-4 bg-[#57463E] p-4">
        <div className="bg-[#FDE8D3] rounded-lg shadow-md py-16 text-center">
          <h3 className="font-semibold text-4xl">X</h3>
          <p className="text-2xl">Quizzes Completed</p>
        </div>
        <div className="bg-[#FDE8D3] rounded-lg shadow-md py-16 text-center">
          <h3 className="font-semibold text-4xl">X</h3>
          <p className="text-2xl">Average Score</p>
        </div>
        <div className="bg-[#FDE8D3] rounded-lg shadow-md py-16 text-center">
          <h3 className="font-semibold text-4xl">X</h3>
          <p className="text-2xl">Badges Earned</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-4">Quiz</h2>

      <div className="w-1/2 grid grid-cols-2 gap-4 mt-4 bg-[#57463E] p-4">
        <button className="bg-[#FDE8D3] rounded-lg shadow-md py-4 font-semibold text-center">Generate Quiz</button>
        <button className="bg-[#FDE8D3] rounded-lg shadow-md py-4 font-semibold text-center">View Quiz History</button>
      </div>
    </div>
  );
};

export default page;
