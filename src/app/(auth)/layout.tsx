"use client";

import { FC, ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return <div className="bg-slate-200 p-10 rounded-md m-auto">{children}</div>;
};

export default AuthLayout;
