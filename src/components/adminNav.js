"use client";

import { cn } from "@/lib/utils";
import { FileTextIcon, MessageCircleIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminNav({ className, ...props }) {
  const pathname = usePathname();

  const routes = [
    {
      href: `/admin`,
      label: (
        <div className="flex items-center">
          <FileTextIcon className="mr-2" /> ARTICLES
        </div>
      ),
      active: pathname === `/admin`,
    },
    {
      href: `/admin/post`,
      label: (
        <div className="flex items-center">
          <MessageCircleIcon className="mr-2" /> POST
        </div>
      ),
      active: pathname === `/admin/post`,
    },
  ];
  return (
    <nav
      className={cn(
        "flex items-center space-x-4 lg:space-x-6 dark:bg-[#1a1a2e] bg-slate-200 p-2  rounded-full ",
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
              ? "text-white bg-primary rounded-full px-4 py-2"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
