"use client";

import { cn } from "@/lib/utils";
import { CalendarDaysIcon, NotebookPenIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MainNav({ className, ...props }) {
  const pathname = usePathname();

  const routes = [
    {
      href: `/`,
      label: (
        <div className="flex items-center rounded-full px-2 py-2">ALL</div>
      ),
      active: pathname === `/`,
    },
    {
      href: `/posts/study`,
      label: (
        <div className="flex items-center rounded-full px-2 py-2">
          <NotebookPenIcon className="mr-2 h-5 w-5" /> STUDY
        </div>
      ),
      active: pathname === `/posts/study`,
    },
    {
      href: `/posts/monthly`,
      label: (
        <div className="flex items-center rounded-full px-2 py-2">
          <CalendarDaysIcon className="mr-2 h-5 w-5" /> MONTHLY
        </div>
      ),
      active: pathname === `/posts/monthly`,
    },
  ];
  return (
    <nav
      className={cn(
        "flex items-center space-x-4 lg:space-x-6 dark:bg-[#1a1a2e] bg-slate-200 p-2 rounded-full border",
        className
      )}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active
              ? "text-white bg-primary/80 rounded-full "
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
