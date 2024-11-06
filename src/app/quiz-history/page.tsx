import History from "@/components/History";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
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
      <h3 className="font-bold text-center text-3xl m-5">Quiz History</h3>
      <History userId={parseInt(session.user.id)} />
    </div>
  );
};

export default page;
