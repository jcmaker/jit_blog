"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "../../../../supabaseClient";
import LZString from "lz-string";
import { ArrowLeft } from "lucide-react";

export default function PostDetail() {
  const { postId } = useParams(); // 동적 라우팅에서 postId 추출
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Supabase에서 특정 postId에 해당하는 포스트 가져오기
        const { data, error } = await supabase
          .from("posts")
          .select("id, title, content, thumbnail, created_at")
          .eq("postId", postId)
          .single();

        if (error || !data) {
          throw new Error("Post not found");
        }

        // thumbnail을 절대 URL로 변환
        const absoluteThumbnailUrl = data.thumbnail
          ? `https://mxvbgvdpvqbnmyksmdhi.supabase.co/storage/v1/object/public/thumbnails/${data.thumbnail}`
          : null;

        const decompressedContent = LZString.decompressFromEncodedURIComponent(
          data.content
        );

        setPost({
          ...data,
          thumbnail: absoluteThumbnailUrl, // 썸네일 URL 업데이트
          content: decompressedContent,
          created_at: new Date(data.created_at).toLocaleDateString("en-EN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        });
      } catch (err) {
        console.error("Error fetching post:", err.message);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Failed to load the post.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-4">
      {/* 돌아가기 버튼 */}
      <button
        onClick={() => router.push("/")}
        className="flex mt-6 px-4 items-center py-2 text-slate-100 dark:text-slate-800 rounded-full hover:bg-blue-600 bg-card-foreground"
      >
        <ArrowLeft size={18} className="mr-2" /> Back to Home
      </button>
      {/* 제목 */}
      <h1 className="text-3xl font-bold post-title">{post.title}</h1>
      <p className="text-gray-500">{post.created_at}</p>

      {/* 썸네일 */}
      {post.thumbnail && (
        <div className="relative w-full">
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

      {/* 내용 */}
      <div
        className="prose max-w-none content-container dark:text-gray-200 "
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
}
