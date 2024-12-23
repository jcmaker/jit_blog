import LZString from "lz-string";
import { NextResponse } from "next/server";
import { supabase } from "../../../../supabaseClient";

export async function GET() {
  try {
    // Fetch posts from Supabase and order by 'created_at' in descending order
    const { data, error } = await supabase
      .from("posts")
      .select("id, title, content, thumbnail, created_at, tag, postId") // 기존 필드 유지
      .order("created_at", { ascending: false }); // 최신순 정렬 추가

    if (error) {
      console.error("Error fetching posts:", error.message);
      return NextResponse.json(
        { error: "Failed to fetch posts" },
        { status: 500 }
      );
    }

    const decompressedPosts = data.map((post) => ({
      ...post,
      content: LZString.decompressFromEncodedURIComponent(post.content),
      thumbnail: post.thumbnail
        ? `https://mxvbgvdpvqbnmyksmdhi.supabase.co/storage/v1/object/public/thumbnails/${post.thumbnail}`
        : null, // 중복 경로 제거
    }));

    // Return the decompressed posts
    return NextResponse.json({ posts: decompressedPosts });
  } catch (err) {
    console.error("Unexpected error:", err.message);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
