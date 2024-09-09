import { MainNav } from "@/components/mainNav";
import TagSearch from "@/components/tagSearch";
import React from "react";

function page() {
  return (
    <main className="flex flex-1 min-h-screen flex-col items-center p-4 pt-8">
      <div className="shine -z-10 absolute inset-0" role="presentation"></div>
      <div className="flex justify-between items-cente mb-12 w-full max-w-3xl">
        <MainNav className="" />
        <TagSearch />
      </div>
    </main>
  );
}

export default page;
