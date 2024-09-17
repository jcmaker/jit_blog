import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import SideNav from "@/components/sideNav";
import { AuthProvider } from "@/context/authProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Welcome to JIT",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthProvider>
        <body
          className={`${inter.className} flex flex-col md:flex-row md:justify-stretch dark:bg-[#10151D] h-screen w-screen `}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <SideNav />
            <main className="flex-1 md:ml-10">{children}</main>
          </ThemeProvider>
        </body>
      </AuthProvider>
    </html>
  );
}
