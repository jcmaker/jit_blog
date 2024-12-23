import React from "react";
import { SidebarTrigger } from "./ui/sidebar";
import Link from "next/link";

function MobileHeader() {
  return (
    <div className="w-screen h-11 border border-b-slate-800 md:hidden flex items-center justify-between p-2">
      <Link href="/">
        <div className="w-full flex items-center justify-center font-bold dark:text-slate-200text-neutral-800 jit_logo  rounded-b-sm">
          JIT
        </div>
      </Link>
      <SidebarTrigger />
    </div>
  );
}

export default MobileHeader;
