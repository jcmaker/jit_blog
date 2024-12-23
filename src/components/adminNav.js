"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";

export function AdminNav({ className, ...props }) {
  const pathname = usePathname();

  const routes = [
    {
      href: `/admin`,
      label: "ARTICLES",
      active: pathname === `/admin`,
    },
    {
      href: `/admin/post`,
      label: "POST",
      active: pathname === `/admin/post`,
    },
    {
      href: `/admin/tags`,
      label: "TAGS",
      active: pathname === `/admin/tags`,
    },
  ];
  return (
    <Menubar
      className={cn(
        "flex justify-start space-x-1 h-12 bg-background max-w-[233px]",
        className
      )}
      {...props}
    >
      {routes.map((route) => (
        <MenubarMenu key={route.href}>
          <MenubarTrigger asChild>
            <Link
              href={route.href}
              className={cn(
                "px-3 py-2 text-sm font-medium transition-colors hover:bg-muted focus:bg-accent focus:text-accent-foreground focus:outline-none",
                route.active
                  ? "bg-accent text-primary"
                  : "text-muted-foreground"
              )}
            >
              {route.label}
            </Link>
          </MenubarTrigger>
        </MenubarMenu>
      ))}
    </Menubar>
  );
}
