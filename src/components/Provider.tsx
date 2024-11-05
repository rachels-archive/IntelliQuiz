"use client";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC, ReactNode } from "react";

const queryClient = new QueryClient();

interface ProviderProps {
  children: ReactNode;
}

const Provider: FC<ProviderProps> = ({ children }) => {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SessionProvider>
  );
};

export default Provider;
