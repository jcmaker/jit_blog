"use client";
import {
  AlignJustifyIcon,
  DoorOpenIcon,
  HomeIcon,
  UserCircle2Icon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ThemeToggle } from "./ThemeToggler";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuth } from "@/context/authProvider";
import { auth } from "fbManager";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function SideNav() {
  const { user } = useAuth();
  const router = useRouter();
  const goToDashboard = (e) => {
    e.preventDefault();
    router.push("/admin");
  };
  return (
    <aside className="sticky top-0 z-20 flex justify-between items-center h-14 w-full border-b bg-slate-100 md:left-0 md:fixed md:inset-y-0   md:flex-col md:w-20  md:h-screen  dark:border-slate-700 md:border-r  dark:bg-[#151F2C] p-2">
      <div className="flex shrink-0 items-center justify-center">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 p-2 md:pt-5 "
          prefetch={true}
        >
          <Image
            src="/jit_header.png"
            alt="Image"
            width={30} // 원하는 너비
            height={30} // 원하는 높이
            style={{ width: "auto", height: "auto" }} // 비율 유지
            className="hidden dark:block"
          />
          <Image
            src="/jit_header_light.png"
            alt="Image"
            width={30} // 원하는 너비
            height={30} // 원하는 높이
            style={{ width: "auto", height: "auto" }} // 비율 유지
            className="dark:hidden"
          />
        </Link>
      </div>
      <nav className="mt-8 md:flex flex-1 flex-col space-y-4 hidden">
        <Link
          href="/"
          className="flex flex-col justify-center items-center rounded-md px-3 py-2 text-sm dark:text-gray-300 text-gray-600 font-extralight transition-colors hover:bg-accent hover:text-accent-foreground"
          prefetch={true}
        >
          <HomeIcon className="h-5 w-5" />
          Home
        </Link>
        {user ? (
          <Link
            href="#"
            className="flex flex-col items-center rounded-md px-3 py-2 text-sm dark:text-gray-300 text-gray-600 font-extralight transition-colors hover:bg-accent hover:text-accent-foreground"
            prefetch={true}
            onClick={() => {
              if (typeof window !== "undefined") {
                auth.signOut();
                window.location.reload();
              }
            }}
          >
            <DoorOpenIcon className=" h-5 w-5" />
            Logout
          </Link>
        ) : (
          <Link
            href="/login"
            className="flex flex-col items-center rounded-md px-3 py-2 text-sm dark:text-gray-300 text-gray-600 font-extralight transition-colors hover:bg-accent hover:text-accent-foreground"
            // prefetch={false}
            // href="#"
            // className="flex flex-col items-center rounded-md px-3 py-2 text-sm dark:text-gray-300 text-gray-600 font-extralight transition-colors hover:bg-accent hover:text-accent-foreground"
            // onClick={(e) => {
            //   e.preventDefault();
            //   toast.error("Justin blocked for some reason...");
            // }}
          >
            <DoorOpenIcon className=" h-5 w-5" />
            Login
          </Link>
        )}
        <ThemeToggle />
      </nav>
      {/* profile img at the bottom */}
      <Avatar
        className="md:flex items-center justify-center md:mb-4 hidden"
        onClick={
          user?.uid === process.env.NEXT_PUBLIC_ADMIN_UID
            ? goToDashboard
            : router.push("/")
        }
      >
        <AvatarImage src={user?.photoURL} />
        <AvatarFallback>
          <UserCircle2Icon className="text-gray-500 font-extralight" />
        </AvatarFallback>
      </Avatar>
      <div className="flex justify-center items-center md:hidden p-2">
        <Sheet>
          <SheetTrigger>
            <AlignJustifyIcon className="h-10 text-slate-400" />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-center justify-around">
            <Link
              href="/"
              className="flex flex-col justify-center items-center rounded-md px-3 py-2 text-sm dark:text-gray-300 text-gray-600 font-extralight transition-colors hover:bg-accent hover:text-accent-foreground"
              prefetch={true}
            >
              <HomeIcon className="h-5 w-5" />
              Home
            </Link>
            {user ? (
              <Link
                href="#"
                className="flex flex-col items-center rounded-md px-3 py-2 text-sm dark:text-gray-300 text-gray-600 font-extralight transition-colors hover:bg-accent hover:text-accent-foreground"
                prefetch={true}
                onClick={() => {
                  auth.signOut().then(() => {
                    if (typeof window !== "undefined") {
                      window.location.reload();
                    }
                  });
                }}
              >
                <DoorOpenIcon className=" h-5 w-5" />
                Logout
              </Link>
            ) : (
              <Link
                href="/login"
                // href="#"
                className="flex flex-col items-center rounded-md px-3 py-2 text-sm dark:text-gray-300 text-gray-600 font-extralight transition-colors hover:bg-accent hover:text-accent-foreground"
                // onClick={(e) => {
                //   e.preventDefault();
                //   toast.error("Justin blocked for some reason...");
                // }}
                prefetch={false}
              >
                <DoorOpenIcon className=" h-5 w-5" />
                Login
              </Link>
            )}
            <ThemeToggle />
            <Avatar
              className="flex items-center justify-center md:mb-4"
              onClick={
                user?.uid === process.env.NEXT_PUBLIC_ADMIN_UID
                  ? goToDashboard
                  : router.push("/")
              }
            >
              <AvatarImage src={user?.photoURL} />
              <AvatarFallback>
                <UserCircle2Icon className="text-gray-500 font-extralight" />
              </AvatarFallback>
            </Avatar>
          </SheetContent>
        </Sheet>
      </div>
    </aside>
  );
}

export default SideNav;
