import { buttonVariants } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { User } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function Home() {
  const sesison = await getServerSession(authOptions);

  return (
  <div>
    <h1 className='text-4xl'>Home</h1>
    <Link className={buttonVariants()} href='/admin'>
      Open My Admin
    </Link>

    <h2>Client Session</h2>
    <User />
    <h2>Server Session</h2>
    {JSON.stringify(sesison)}
  </div>
  );
}
