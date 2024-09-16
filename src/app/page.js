"use client";
import { MainNav } from "@/components/mainNav";
import axios from "axios";
import { useEffect, useState } from "react";
import TagSearch from "@/components/tagSearch";
import PostCard from "@/components/PostCard";

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
      {posts.length > 0 ? (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      ) : (
        <p>No posts found</p>
      )}
    </main>
  );
}
