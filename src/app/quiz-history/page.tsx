import History from "@/components/History";
import { buttonVariants } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

type Props = {};

const page = async (props: Props) => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect("/");
  }
  return (
    <div className="w-full">
      <div className="flex flex-row justify-between items-center w-3/4 mx-auto py-8">
        <h3 className="font-bold text-center text-3xl">Quiz History</h3>
        <Link href="/dashboard" className={buttonVariants()}>
          Back to Dashboard
        </Link>
      </div>

      <History userId={parseInt(session.user.id)} />
    </div>
  );
};

export default page;
