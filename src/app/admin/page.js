"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { useRouter } from "next/navigation";
import { AdminNav } from "@/components/adminNav";
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

function Adminpage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState([]); // Ensure posts is an array
  const [fetchError, setFetchError] = useState(false);

  const userUID = session?.user.id;

  if (process.env.NEXT_PUBLIC_ADMIN_ID !== userUID) {
    router.push("/");
  }

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        const result = await response.json();

        if (!Array.isArray(result.posts)) {
          throw new Error("Invalid posts format");
        }

        setPosts(result.posts || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setFetchError(true);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 w-full">
      <header className="admin-header">
        <AdminNav />
      </header>
      {/* <div>
        {fetchError && <p>Error fetching posts.</p>}
        {!fetchError && posts.length === 0 && <p>No posts found.</p>}
        <ul>
          {Array.isArray(posts) &&
            posts.map((post) => (
              <li key={post.id} className="mb-4 p-4 border rounded">
                <h2 className="text-xl font-bold">{post.title}</h2>
                <div
                  dangerouslySetInnerHTML={{ __html: post.content }}
                  className="content-container"
                ></div>
              </li>
            ))}
        </ul>
      </div> */}
      <Table className="">
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
            Array.isArray(posts) &&
            posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>{post.title}</TableCell>
                <TableCell>
                  {post.created_at
                    ? new Date(post.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Unknown date"}
                </TableCell>
                <TableCell>
                  {post.tag && post.tag.length > 0 ? (
                    post.tag.map((tag) => (
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
                    // onClick={() => router.push(`/admin/edit-post/${post.id}`)}
                  >
                    <Pencil className="w-5 h-5 opacity-25" />
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
    </div>
  );
}

export default Adminpage;
