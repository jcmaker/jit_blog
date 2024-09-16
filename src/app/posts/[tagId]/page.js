"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { MainNav } from "@/components/mainNav";
import TagSearch from "@/components/tagSearch";
import PostCard from "@/components/PostCard";
import { useParams } from "next/navigation";

function PostsByTagPage() {
  const { tagId } = useParams();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPostsByTag = async () => {
      try {
        const response = await axios.get("/api/get-content");
        const filteredPosts = response.data.filter(
          (post) => Array.isArray(post.tags) && post.tags.includes(tagId)
        );
        setPosts(filteredPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    if (tagId) {
      fetchPostsByTag();
    }
  }, [tagId]);

  console.log(tagId);

  return (
    <main className="flex flex-1 min-h-screen flex-col items-center p-4 pt-8">
      <div className="shine -z-10 absolute inset-0" role="presentation"></div>
      <div className="flex justify-between items-center mb-12 w-full max-w-3xl">
        <MainNav />
        <TagSearch />
      </div>
      <h1 className="text-3xl font-bold mb-8">Posts tagged with #{tagId}</h1>
      {posts.length > 0 ? (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      ) : (
        <p>No posts found for #{tagId}</p>
      )}
    </main>
  );
}

export default PostsByTagPage;
