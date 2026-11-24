import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Google Play Store",
  description: "Find the apps and games you love",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <SessionProvider>
          <Header />
          <div className="max-w-screen-xl mx-auto px-4 py-6 flex gap-6">
            <Sidebar />
            <main className="flex-1 min-w-0 pb-20 lg:pb-0">
              {children}
            </main>
          </div>
          <Footer />
          <BottomNav />
        </SessionProvider>
      </body>
    </html>
  );
}
