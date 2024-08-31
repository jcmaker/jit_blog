"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "lucide-react";
import Link from "next/link";

export function ThemeToggle() {
  const { setTheme } = useTheme("system");

  return (
    <Link
      href="#"
      variant="outline"
      size="icon"
      className="flex flex-col items-center rounded-md px-3 py-2 text-sm text-gray-300 font-extralight transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      <SunIcon
        className="h-5 w-5rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
        onClick={() => setTheme("dark")}
      />
      <MoonIcon
        className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
        onClick={() => setTheme("light")}
      />
      Mode
    </Link>
  );
}
