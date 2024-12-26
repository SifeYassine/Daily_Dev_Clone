import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthProvider from "@/providers/AuthProvider";
import { PostsProvider } from "@/context/PostsContext";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "daily.dev | Where developers share news",
  description: "daily.dev | Where developers share news",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={nunito.className}>
        <ToastContainer />
        <AuthProvider>
          <PostsProvider>{children}</PostsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
