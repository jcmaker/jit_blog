import { AdminNav } from "@/components/adminNav";
import React from "react";

function page() {
  return (
    <main className="flex flex-1 min-h-screen flex-col items-center p-16">
      <div className="shine -z-10 absolute inset-0" role="presentation"></div>
      <div>
        <AdminNav />
      </div>
    </main>
  );
}

export default page;
