"use client";
import { MainNav } from "@/components/mainNav";
import axios from "axios";
import { useEffect, useState } from "react";
import TagSearch from "@/components/tagSearch";
import PostCard from "@/components/PostCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [posts, setPosts] = useState([]); // All posts
  const [visiblePosts, setVisiblePosts] = useState(5); // Number of posts visible
  const [loading, setLoading] = useState(false); // Loading state
  const [isLoadingInitial, setIsLoadingInitial] = useState(true); // Initial loading state

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoadingInitial(true);
        const response = await axios.get("/api/get-content");
        setPosts(response.data);
        setIsLoadingInitial(false);
      } catch (error) {
        console.error("Error fetching content:", error);
        setIsLoadingInitial(false);
      }
    };

    fetchPosts();
  }, []);

  // Load more posts when the button is clicked
  const loadMorePosts = () => {
    setLoading(true);
    setTimeout(() => {
      setVisiblePosts((prevVisiblePosts) => prevVisiblePosts + 5); // Increase by 5 posts
      setLoading(false);
    }, 1000); // Simulate loading delay
  };

  return (
    <main className="flex flex-1 min-h-screen flex-col items-center p-4 pt-8">
      <div className="shine -z-10 absolute inset-0" role="presentation"></div>
      <div className="flex justify-between items-center mb-12 w-full max-w-3xl">
        <MainNav className="" />
        <TagSearch />
      </div>

      {/* Show loading spinner during initial loading */}
      {isLoadingInitial ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Display posts */}
          {posts.length > 0 ? (
            <>
              {posts.slice(0, visiblePosts).map((post) => (
                <PostCard key={post.id} post={post} />
              ))}

              {/* Load More button */}
              {visiblePosts < posts.length && (
                <div className="mt-6">
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <Button
                      onClick={loadMorePosts}
                      className="px-4 py-2 bg-blue-600 text-white rounded-full transition-all duration-200 ease-in-out hover:bg-blue-700 hover:scale-105"
                      disabled={loading}
                    >
                      Load More
                    </Button>
                  )}
                </div>
              )}
            </>
          ) : (
            <p>No posts found</p>
          )}
        </>
      )}

      {/* <Footer className="fixed bottom-0" /> */}
    </main>
  );
}
