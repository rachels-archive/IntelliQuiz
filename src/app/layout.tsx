import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";
import Provider from "@/components/Provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IntelliQuiz",
  description: "Quiz App powered by AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <main className="h-screen flex flex-col">
            <Navbar />
            <div className="flex-1 flex">{children}</div>
          </main>
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
