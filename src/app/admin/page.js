"use client";
import { AdminNav } from "@/components/adminNav";
import { useAuth } from "@/context/authProvider";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect } from "react";

function Adminpage() {
  const { user } = useAuth();
  const router = useRouter(); // useRouter 훅 사용

  if (!user?.uid || user?.uid !== process.env.NEXT_PUBLIC_ADMIN_UID) {
    return (
      <main className="flex flex-1 min-h-screen flex-col">
        <h1>Loading</h1>
        {/* 어드민 전용 콘텐츠 */}
      </main>
    ); // 사용자 정보를 불러오는 동안 로딩 표시
  }
  if (
    !user?.uid ||
    user?.uid.toLowerCase() !== process.env.NEXT_PUBLIC_ADMIN_UID.toLowerCase()
  ) {
    // 사용자 인증은 되었으나 어드민이 아닌 경우 홈 페이지로 리디렉션
    router.push("/");
  }

  return (
    <main className="flex flex-1 min-h-screen flex-col items-center p-16">
      <div className="shine -z-10 absolute inset-0" role="presentation"></div>
      <div>
        <AdminNav />
      </div>
      {/* 어드민 전용 콘텐츠 */}
    </main>
  );
}

export default Adminpage;
