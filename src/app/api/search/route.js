// src/app/api/search/route.js

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);

export async function POST(req) {
  try {
    const { query } = await req.json(); // 클라이언트에서 보낸 JSON 데이터 파싱

    // Supabase에서 검색 실행
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .ilike("title", `%${query}%`);

    if (error) {
      console.error("Error fetching posts:", error);
      return new Response(JSON.stringify({ error: "Failed to fetch posts" }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ posts: data || [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("API Error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
