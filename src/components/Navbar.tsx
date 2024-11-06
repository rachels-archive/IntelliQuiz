import Link from "next/link";
import { HandMetal } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import UserAccountnav from "./UserAccountnav";

const Navbar = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className=" bg-[#342925] py-3  w-full">
      <div className="container flex items-center justify-between">
        <Link href="/" className="text-2xl text-white font-bold">
          IntelliQuiz
        </Link>
        {session?.user ? (
          <UserAccountnav />
        ) : (
          <Link
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-white text-[#342925] hover:bg-gray-200 transition-colors h-10 px-4 py-2"
            href="/sign-in"
          >
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
