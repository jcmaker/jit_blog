"use client";
import {
  DoorOpenIcon,
  HomeIcon,
  UserCircle2Icon,
  UserIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ThemeToggle } from "./ThemeToggler";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuth } from "@/context/authProvider";
import { auth } from "fbManager";

function SideNav() {
  const { user } = useAuth();
  return (
    <aside className="inset-y-0 z-20 flex justify-between items-center md:flex-col md:w-20 h-16 md:h-full w-full border-r dark:bg-[#151F2C] p-2">
      <div className="flex shrink-0 items-center justify-center">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 md:pt-5"
          prefetch={true}
        >
          <Image
            src="/jit_header.png"
            alt="Image"
            width={30}
            height={30}
            className=" object-cover "
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
              auth.signOut();
              window.location.reload();
            }}
          >
            <DoorOpenIcon className=" h-5 w-5" />
            Logout
          </Link>
        ) : (
          <Link
            href="/login"
            className="flex flex-col items-center rounded-md px-3 py-2 text-sm dark:text-gray-300 text-gray-600 font-extralight transition-colors hover:bg-accent hover:text-accent-foreground"
            prefetch={true}
          >
            <DoorOpenIcon className=" h-5 w-5" />
            Login
          </Link>
        )}
        <ThemeToggle />
      </nav>
      {/* profile img at the bottom */}
      <Avatar className="flex items-center justify-center md:mb-4">
        <AvatarImage src={user?.photoURL} />
        <AvatarFallback>
          <UserCircle2Icon className="text-gray-500 font-extralight" />
        </AvatarFallback>
      </Avatar>
    </aside>
  );
}

export default SideNav;
