"use client";
import { AdminNav } from "@/components/adminNav";
import { useAuth } from "@/context/authProvider";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function Adminpage() {
  const { user } = useAuth();
  const router = useRouter(); // useRouter 훅 사용
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/api/get-content");
        setPosts(response.data); // 데이터를 상태로 설정
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  console.log(posts);

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
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="post">
            {post.mainTitle}
            <Image
              width={500}
              height={300}
              src={post.thumbnail}
              alt="thumbnail"
            />
            {/* <div dangerouslySetInnerHTML={{ __html: post.content }} /> */}
          </div>
        ))
      ) : (
        <p>No posts found</p>
      )}
    </main>
  );
}

export default Adminpage;
