"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "./auth/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Lock } from "lucide-react";

export default function Page() {
  const { session, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [posts, setPosts] = useState([]); // All posts
  const [recentPost, setRecentPost] = useState(null); // Most recent post
  const [tags, setTags] = useState({
    study: [],
    monthly: [],
  });
  const [fetchError, setFetchError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ADMIN_ID == session?.user.id) {
      setIsAdmin(true);
    }
  }, [session]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        const result = await response.json();

        if (!Array.isArray(result.posts)) {
          throw new Error("Invalid posts format");
        }

        const allPosts = result.posts.map((post) => ({
          ...post,
          created_at: new Date(post.created_at).toLocaleDateString("en-EN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        }));

        const sortedPosts = result.posts
          .map((post) => ({
            ...post,
            created_at: new Date(post.created_at).toLocaleDateString("en-EN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          }))
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setPosts(allPosts);
        setRecentPost(sortedPosts[0]); // 가장 최근 포스트 설정

        const studyPosts = allPosts.filter((post) =>
          post.tag?.includes("study")
        );
        const monthlyPosts = allPosts.filter((post) =>
          post.tag?.includes("monthly")
        );

        setTags({
          study: studyPosts,
          monthly: monthlyPosts,
        });
      } catch (error) {
        console.error("Error fetching posts:", error);
        setFetchError(true);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <span className="animate-pulse text-lg font-bold">Loading...</span>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-8 flex flex-col items-center w-full">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4 flex w-full justify-start">
        HomePage
      </h1>

      {recentPost && (
        <div className="p-2 w-full border rounded-md shadow-md mb-6  max-w-[800px]">
          <Link
            href={`post/${recentPost.postId}`}
            className="flex flex-col bg-[#18181B] dark:bg-card rounded-md p-6"
          >
            <div className="flex justify-between items-center ">
              <div>
                <h1 className="font-bold text-2xl sm:text-2xl text-slate-50">
                  Recent Post
                </h1>
                <span className="text-slate-200">
                  Latest story of Justin&#39;s
                </span>
              </div>
              <ChevronRight className="text-slate-200" />
            </div>

            <h2 className="font-bold text-lg sm:text-xl mb-2 mt-6 text-slate-100">
              {recentPost.title}
            </h2>
            <p className="dark:text-gray-500 text-slate-300 text-sm mb-4">
              {recentPost.created_at}
            </p>

            {/* HTML 미리보기 표시 */}
            <div
              className="dark:text-gray-700 text-slate-500 text-sm"
              dangerouslySetInnerHTML={{
                __html: recentPost.content?.slice(0, 200),
              }}
            ></div>
            <span className="dark:text-gray-700 text-slate-500 text-sm">
              ...
            </span>
            <div>
              <Button className="bg-[#F7FAFC] text-slate-900 mt-2">
                Read More
              </Button>
            </div>
          </Link>
        </div>
      )}

      {/* Tabs for All Screens */}
      <Tabs defaultValue="all" className="w-full flex flex-col items-center">
        <TabsList className="grid w-full grid-cols-3 mb-4 max-w-[400px]">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="study">Study</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>

        {/* All Posts */}
        <TabsContent
          value="all"
          className="w-full flex flex-col items-center mt-0"
        >
          <PostSection posts={posts} />
        </TabsContent>

        {/* Study Posts */}
        <TabsContent
          value="study"
          className="w-full flex flex-col items-center mt-0"
        >
          <PostSection posts={tags.study} />
        </TabsContent>

        {/* Monthly Posts */}
        <TabsContent
          value="monthly"
          className="w-full flex flex-col items-center mt-0"
        >
          <PostSection posts={tags.monthly} />
        </TabsContent>
      </Tabs>

      {isAdmin && (
        <Button
          onClick={() => router.push("/admin")}
          className="fixed mt-4 rounded-full bottom-4 right-4"
        >
          <Lock />
        </Button>
      )}
    </div>
  );
}

function PostSection({ posts }) {
  return (
    <div className="space-y-4 w-full flex flex-col items-center">
      {posts.map((post) => (
        <Link
          href={`post/${post.postId}`}
          key={post.id}
          className="p-4 border rounded-md shadow-md flex flex-col w-full max-w-[800px]"
        >
          {post.thumbnail && (
            <div className="relative w-full overflow-hidden rounded-md">
              <div className="relative h-0" style={{ paddingBottom: "56.25%" }}>
                {/* 16:9 비율 유지 */}
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  layout="fill"
                  objectFit="cover"
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </div>
          )}
          <div className="flex items-center mt-4">
            <Image
              src="/author.webp"
              alt="author"
              width="40"
              height="40"
              className="rounded-md"
            />
            <div className="flex flex-col items-start flex-2 ml-4">
              <h3 className="font-semibold text-md">{post.title}</h3>
              <p className="text-gray-500 text-xs">{post.created_at}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );

  // 나중에 포스트 글 많아지면 글 추가 버튼 만들기
}
