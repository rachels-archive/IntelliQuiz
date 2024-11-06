"use client";
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";

const UserAccountnav = () => {
  return (
    <Button
      onClick={() =>
        signOut({
          redirect: true,
          callbackUrl: `${window.location.origin}/sign-in`,
        })
      }
      className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-white text-[#342925] hover:bg-gray-200 transition-colors h-10 px-4 py-2"
    >
      Sign Out
    </Button>
  );
};

export default UserAccountnav;
