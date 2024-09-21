"use client";
import { useEffect, useState } from "react";
import { db } from "fbManager"; // Firebase setup
import { collection, getDocs, query, where } from "firebase/firestore";
import { MainNav } from "@/components/mainNav";
import TagSearch from "@/components/tagSearch";
import PostCard from "@/components/PostCard";
import { useParams } from "next/navigation";
import { TagIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function PostsByTagPage() {
  const { tagId } = useParams();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPostsByTag = async () => {
      if (tagId) {
        try {
          // Firestore query to get posts containing the specific tag
          const q = query(
            collection(db, "posts"),
            where("tags", "array-contains", tagId)
          );
          const querySnapshot = await getDocs(q);
          const filteredPosts = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setPosts(filteredPosts); // Set posts in state
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      }
    };

    fetchPostsByTag();
  }, [tagId]);

  return (
    <main className="flex flex-1 min-h-screen flex-col items-center p-4 pt-8">
      <div className="shine -z-10 absolute inset-0" role="presentation"></div>
      <div className="flex justify-between items-center mb-12 w-full max-w-3xl">
        <MainNav />
        <TagSearch />
      </div>
      {/* <h1 className="text-3xl font-bold mb-8">Posts tagged with #{tagId}</h1> */}
      <div className="text-card-foreground rounded-lg mb-8 w-full max-w-3xl p-1">
        <div className="flex items-center space-x-2">
          <TagIcon className="w-5 h-5 text-primary" />
          <h1 className="text-lg">
            Exploring <Badge className="hover:text-slate-200">#{tagId}</Badge>
          </h1>
        </div>
        <p className="mt-2 text-muted-foreground text-sm">
          Discover posts related to this tag
        </p>
      </div>
      {posts.length > 0 ? (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      ) : (
        <p>No posts found for #{tagId}</p>
      )}
    </main>
  );
}

export default PostsByTagPage;
