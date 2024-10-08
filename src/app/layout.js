import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import SideNav from "@/components/sideNav";
import { AuthProvider } from "@/context/authProvider";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "JIT, Justin's Blog",
  description: "Records of My JITs, 내 짓거리들",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} flex flex-col md:flex-row md:justify-stretch dark:bg-[#10151D] h-screen w-screen `}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <SideNav />
            <main className="flex-1 md:ml-10">
              <Toaster />
              {children}
              <Analytics />
            </main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
