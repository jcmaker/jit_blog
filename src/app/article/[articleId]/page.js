"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton"; // Import Shadcn UI Skeleton component

function ArticlePage() {
  const { articleId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  // get-content API에서 데이터를 가져오는 함수
  useEffect(() => {
    const fetchPost = async () => {
      if (typeof window !== "undefined") {
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
          setLoading(false); // Stop loading after fetching
        } catch (error) {
          console.error("Error fetching post:", error);
          setLoading(false); // Stop loading even if there's an error
        }
      }
    };

    if (articleId) {
      fetchPost();
    }
  }, [articleId]);

  return (
    <main className="flex flex-1 min-h-screen flex-col items-center p-1 pt-8">
      <div className="shine -z-10 absolute inset-0" role="presentation"></div>
      <div className="flex justify-between items-center mb-6 w-full max-w-3xl ">
        <Link
          href="/"
          className="mb-4 dark:text-gray-400 text-slate-600 flex items-center dark:bg-[#0F151D] bg-slate-200 p-4 rounded-full py-2 border"
        >
          <ArrowLeft className="mr-2" /> Back to Home
        </Link>
      </div>
      <div className="rounded-xl w-full max-w-3xl dark:bg-[#0F151D] bg-slate-200 border">
        {loading ? (
          // Display skeleton while loading
          <div className="p-4 md:p-8">
            <Skeleton className="h-72 w-full mb-4 rounded-xl" />{" "}
            {/* Image skeleton */}
            <Skeleton className="h-8 w-3/4 mb-2" /> {/* Title skeleton */}
            <Skeleton className="h-4 w-1/4 mb-6" /> {/* Date skeleton */}
            <Skeleton className="h-5 w-full mb-2" /> {/* Content skeleton */}
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-5 w-full mb-2" />
          </div>
        ) : post ? (
          <>
            <div className="relative w-full md:h-96 h-44 mb-2">
              <Image
                src={post.thumbnail}
                alt="Thumbnail"
                layout="fill"
                objectFit="cover"
                priority={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="rounded-xl"
              />
            </div>

            <div className="p-4 md:p-8">
              <h1 className="text-2xl md:text-4xl font-bold dark:text-white mb-2">
                {post.mainTitle}
              </h1>

              <div className="flex items-center space-x-4 mb-12">
                <p className="text-sm dark:text-gray-400">
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
                <p className="text-sm dark:text-gray-400">by Justin Cho</p>
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
          <p>No post found</p>
        )}
      </div>
    </main>
  );
}

export default ArticlePage;
