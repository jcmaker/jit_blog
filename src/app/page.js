"use client";
import { MainNav } from "@/components/mainNav";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import TagSearch from "@/components/tagSearch";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/api/get-content");
        setPosts(response.data);

        posts.forEach((post) => {
          console.log(post.contentURL); // 저장된 content의 URL을 출력
        });
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };

    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="flex flex-1 min-h-screen flex-col items-center p-4 pt-8">
      <div className="shine -z-10 absolute inset-0" role="presentation"></div>
      <div className="flex justify-between items-center mb-12 w-full max-w-3xl">
        <MainNav className="" />
        <TagSearch />
      </div>
      {/* 어드민 전용 콘텐츠 */}
      {posts.length > 0 ? (
        posts.map((post) => (
          <Link
            href={`/article/${post.id}`}
            key={post.id}
            className="post w-full max-w-3xl mb-8" // 최대 너비 설정 및 마진 추가
          >
            <div className="rounded-2xl overflow-hidden shadow-lg bg-[#11161e] border border-1 border-slate-700">
              <div className="relative w-full h-72">
                {" "}
                {/* 이미지 컨테이너 설정 */}
                <Image
                  src={post.thumbnail}
                  alt="thumbnail"
                  layout="fill"
                  objectFit="cover" // 이미지가 컨테이너를 꽉 채우도록 설정
                  className="rounded-t-lg" // 모서리 둥글게 처리
                />
              </div>
              <div className="p-4 flex items-center">
                <Avatar className="flex items-center justify-center w-14 h-14 rounded-xl">
                  <AvatarImage
                    src={
                      "https://lh3.googleusercontent.com/a/ACg8ocI73C892jeYmjEtpdDikqLoXqr--5Cfww0IGuOD86s6lcyQrBgW=s96-c"
                    }
                  />
                </Avatar>
                <div className="ml-4">
                  <h1 className="md:text-2xl text-xl font-semibold text-slate-300 mb-2">
                    {post.mainTitle}
                  </h1>
                  <div className="flex w-full">
                    <p className="flex-2 flex justify-start items-center mr-4 text-xs">
                      Jusin Cho
                    </p>
                    <p className="text-xs">
                      {post.createdAt
                        ? new Date(
                            post.createdAt.seconds * 1000
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Unknown date"}
                    </p>
                  </div>
                </div>
                <div className="hidden md:flex md:flex-wrap md:flex-1 gap-2 items-center justify-end mt-1">
                  {post.tags && post.tags.length > 0
                    ? post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-blue-600 text-xs px-2 py-1 rounded-lg"
                        >
                          #{tag}
                        </span>
                      ))
                    : null}
                </div>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <p>No posts found</p>
      )}
    </main>
  );
}
