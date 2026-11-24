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
      <body className={`${inter.className} min-h-screen bg-white text-[#202124] antialiased`}>
        <SessionProvider>
          <Header />
          <div className="app-shell px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8 pt-4 lg:pt-6">
              <Sidebar />
              <main className="min-w-0 flex-1 pb-24 lg:pb-10">
                {children}
              </main>
            </div>
          </div>
          <Footer />
          <BottomNav />
        </SessionProvider>
      </body>
    </html>
  );
}
