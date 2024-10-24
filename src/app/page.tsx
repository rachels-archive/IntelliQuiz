// app/page.tsx
import { authOptions } from "@/lib/auth";
import { User } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h1 className="text-4xl">Home</h1>
      <Link
        href="/dashboard"
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
      >
        Open My Admin
      </Link>

      <h2>Client Session</h2>
      <User />
      <h2>Server Session</h2>
      {JSON.stringify(session, null, 2)}
    </div>
  );
}
