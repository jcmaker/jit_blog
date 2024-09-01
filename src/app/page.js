"use client";
import { useAuth } from "@/context/authProvider";

export default function Home() {
  const { user } = useAuth();

  if (user?.uid === process.env.NEXT_PUBLIC_ADMIN_UID) {
    console.log(user.uid);
  }

  return (
    <main className="flex flex-1 min-h-screen flex-col items-center justify-between p-16">
      <div className="shine -z-10 absolute inset-0" role="presentation"></div>
      main
    </main>
  );
}
