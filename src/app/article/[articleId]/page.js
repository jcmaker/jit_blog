"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function ArticlePage() {
  const { articleId } = useParams();
  const [post, setPost] = useState(null);

  // get-content API에서 데이터를 가져오는 함수
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get("/api/get-content");
        console.log("All posts:", response.data);
        const foundPost = response.data.find((post) => post.id === articleId);
        console.log("Found post:", foundPost);
        if (foundPost) {
          setPost(foundPost);
        } else {
          console.log("No such post!");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    if (articleId) {
      fetchPost();
    }
  }, [articleId]);

  console.table(post);

  return (
    <main className="flex flex-1 min-h-screen flex-col items-center p-1 pt-8">
      <div className="shine -z-10 absolute inset-0" role="presentation"></div>
      <div className="flex justify-between items-center mb-6 w-full max-w-3xl ">
        <Link
          href="/"
          className="mb-4 text-gray-400 flex items-center bg-[#0F151D] p-4 rounded-full py-2 border"
        >
          <ArrowLeft className="mr-2" /> Back to Home
        </Link>
      </div>
      <div className="rounded-xl w-full max-w-3xl bg-[#0F151D] border">
        {post ? (
          <>
            <div className="relative w-full md:h-96 h-44 mb-2">
              <Image
                src={post.thumbnail}
                alt="Thumbnail"
                layout="fill" // 부모 요소를 가득 채우도록 설정
                objectFit="cover" // 이미지가 부모 영역을 채우며 비율을 유지
                priority={true} // LCP(Largest Contentful Paint) 최적화를 위해 우선 로드
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // 화면 크기에 따라 다른 크기로 로드
                className="rounded-xl" // 이미지의 모서리를 둥글게 처리
              />
            </div>

            <div className="p-4 md:p-8">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
                {post.mainTitle}
              </h1>

              <div className="flex items-center space-x-4 mb-12">
                <p className="text-sm text-gray-400">
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
                <p className="text-sm text-gray-400">by Justin Cho</p>
              </div>

              <div className="prose">
                {post.content ? (
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                ) : (
                  <p>Loading content...</p>
                )}
              </div>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </main>
  );
}

export default ArticlePage;
