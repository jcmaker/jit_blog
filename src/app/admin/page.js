"use client";
import { AdminNav } from "@/components/adminNav";
import { useAuth } from "@/context/authProvider";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2Icon } from "lucide-react";
import { db } from "fbManager"; // Your Firebase setup
import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  deleteDoc,
} from "firebase/firestore";
import LZString from "lz-string"; // For decompressing content
import toast from "react-hot-toast";

function Adminpage() {
  const { user } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsCollection = collection(db, "posts");
        const q = query(postsCollection, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const fetchedPosts = querySnapshot.docs.map((doc) => {
          let postData = doc.data();

          // Decompress content if it exists
          if (postData.content) {
            postData.content = LZString.decompressFromEncodedURIComponent(
              postData.content
            );
          }

          return {
            id: doc.id,
            ...postData,
          };
        });

        setPosts(fetchedPosts);
      } catch (error) {
        toast.error("fetching error", error);
      }
    };

    fetchPosts();
  }, []);

  // Delete post handler (delete directly from Firestore)
  const handleDelete = async (postId) => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        // Delete the post document from Firestore
        const postRef = doc(db, "posts", postId);
        await deleteDoc(postRef);

        // Update the posts state to remove the deleted post
        setPosts(posts.filter((post) => post.id !== postId));
        toast.success("Successfully posted!");
      } catch (error) {
        toast.error("delete error", error);
      }
    }
  };

  if (!user?.uid || user?.uid !== process.env.NEXT_PUBLIC_ADMIN_UID) {
    return (
      <main className="flex flex-1 min-h-screen flex-col">
        <h1>Loading</h1>
      </main>
    );
  }

  return (
    <main className="flex flex-1 min-h-screen flex-col items-center p-4 pt-8">
      <div className="shine -z-10 absolute inset-0" role="presentation"></div>
      <div>
        <AdminNav className="mb-12" />
      </div>

      <Table className="w-full max-w-7xl mb-8">
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>CreatedAt</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.length > 0 ? (
            posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>{post.mainTitle}</TableCell>
                <TableCell>
                  {post.createdAt
                    ? new Date(
                        post.createdAt.seconds * 1000
                      ).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Unknown date"}
                </TableCell>
                <TableCell>
                  {post.tags && post.tags.length > 0 ? (
                    post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-blue-500 text-white text-xs px-2 py-1 rounded-lg mr-2"
                      >
                        #{tag}
                      </span>
                    ))
                  ) : (
                    <span>No tags</span>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="primary"
                    onClick={() => router.push(`/admin/edit-post/${post.id}`)}
                  >
                    <Pencil className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(post.id)}
                    className="ml-2"
                  >
                    <Trash2Icon className="w-5 h-5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4}>No posts found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </main>
  );
}

export default Adminpage;
