"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { db } from "fbManager"; // Firebase setup
import { doc, getDoc } from "firebase/firestore"; // Firestore methods
import LZString from "lz-string"; // For decompressing content
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton"; // Import Shadcn UI Skeleton component

function ArticlePage() {
  const { articleId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postDoc = doc(db, "posts", articleId); // Get reference to the specific post
        const docSnapshot = await getDoc(postDoc);

        if (docSnapshot.exists()) {
          let postData = docSnapshot.data();

          // If there's a contentURL, fetch and decompress content from there
          if (postData.contentURL) {
            try {
              const response = await fetch(postData.contentURL); // Use fetch to get the content as a text file
              const textContent = await response.text(); // Read the response as plain text

              // Decompress the content
              postData.content =
                LZString.decompressFromEncodedURIComponent(textContent);

              if (!postData.content) {
                console.error("Decompression failed or content is empty.");
                postData.content = "Error: Content could not be decompressed.";
              }
            } catch (error) {
              console.error("Error fetching and decompressing content:", error);
              postData.content = "Error fetching content";
            }
          }

          setPost(postData); // Set the post data in state
          // await updateDoc(postDoc, {
          //   views: increment(1), // Increment the views count by 1
          // });
          console.log("Found post:", postData);
        } else {
          console.log("No such post!");
        }
        setLoading(false); // Stop loading after fetching
      } catch (error) {
        console.error("Error fetching post:", error);
        setLoading(false); // Stop loading even if there's an error
      }
    };

    if (articleId) {
      fetchPost();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                className="rounded-xl  slide-bottom"
              />
            </div>

            <div className="p-4 md:p-8 slide-bottom">
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
                {/* <span className="text-sm dark:text-gray-400 flex items-center">
                  <EyeIcon className="mr-1" /> {post.views}
                </span> */}
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
