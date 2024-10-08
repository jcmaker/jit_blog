"use client";

import { cn } from "@/lib/utils";
import { FileTextIcon, HashIcon, NotebookPenIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminNav({ className, ...props }) {
  const pathname = usePathname();

  const routes = [
    {
      href: `/admin`,
      label: (
        <div className="flex items-center rounded-full px-2 py-2">
          <FileTextIcon className="mr-2 h-5 w-5" /> ARTICLES
        </div>
      ),
      active: pathname === `/admin`,
    },
    {
      href: `/admin/post`,
      label: (
        <div className="flex items-center rounded-full px-2 py-2">
          <NotebookPenIcon className="mr-2 h-5 w-5" /> POST
        </div>
      ),
      active: pathname === `/admin/post`,
    },
    {
      href: `/admin/tags`,
      label: (
        <div className="flex items-center rounded-full px-2 py-2">
          <HashIcon className="mr-2 h-5 w-5" /> TAGS
        </div>
      ),
      active: pathname === `/admin/tags`,
    },
  ];
  return (
    <nav
      className={cn(
        "flex items-center space-x-4 lg:space-x-6 dark:bg-[#1a1a2e] bg-slate-200 p-2  rounded-full border",
        className
      )}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-[#FF9101]",
            route.active
              ? "text-white bg-[#FFC401] rounded-full"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
