"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { db } from "fbManager";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AdminNav } from "@/components/adminNav";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
// import axios from "axios";

function EditPostPage() {
  const { postId } = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [mainTitle, setMainTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  useEffect(() => {
    // Fetch the post details
    const fetchPost = async () => {
      if (typeof window !== "undefined") {
        const docRef = doc(db, "posts", postId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const postData = docSnap.data();
          setPost(postData);
          setMainTitle(postData.mainTitle);
          setContent(postData.content);
          setThumbnail(postData.thumbnail);
        } else {
          console.log("Post not found!");
        }
      }
    };

    if (postId) {
      fetchPost();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle form submission to update the post
  const handleUpdatePost = async (e) => {
    e.preventDefault();

    try {
      const compressedContent = LZString.compressToEncodedURIComponent(content); // Optional: Compress content

      // Update the post in Firestore
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        mainTitle,
        content: compressedContent,
        thumbnail,
      });

      alert("Post updated successfully!");
      router.push("/admin");
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  return (
    <main className="flex flex-1 min-h-screen flex-col items-center p-4 pt-8">
      <AdminNav />
      <h1>Edit Post</h1>
      {post ? (
        <form onSubmit={handleUpdatePost}>
          <Input
            type="text"
            placeholder="Main Title"
            value={mainTitle}
            onChange={(e) => setMainTitle(e.target.value)}
            required
          />
          <ReactQuill
            value={content}
            onChange={(value) => setContent(value)}
            theme="snow"
            className="bg-slate-900 text-white max-w-4xl"
          />
          <Button type="submit">Update Post</Button>
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </main>
  );
}

export default EditPostPage;
