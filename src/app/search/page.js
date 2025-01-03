"use client";
import { useState } from "react";
import Link from "next/link";
import SearchBar from "@/components/searchBar";
import { decompressFromEncodedURIComponent } from "lz-string";

export default function SearchPage() {
  const [results, setResults] = useState([]); // 빈 배열로 초기화

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Search Posts</h1>

      {/* 검색 바 */}
      <SearchBar onSearch={setResults} />

      {/* 검색 결과 */}
      <div className="mt-6">
        {results?.length > 0 ? ( // results가 정의되어 있고 길이가 0 이상인지 확인
          results.map((post) => (
            <div key={post.id} className="mb-4 p-4 border rounded">
              <Link href={`/post/${post.postId}`}>
                <h2 className="text-lg font-bold">{post.title}</h2>
              </Link>
              <p className="text-gray-500">
                {/* created_at을 Date 객체로 변환 후 표시 */}
                {new Date(post.created_at).toLocaleDateString("en-EN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <div
                className="dark:text-gray-700 text-slate-500 text-sm"
                dangerouslySetInnerHTML={{
                  __html:
                    decompressFromEncodedURIComponent(post.content)?.slice(
                      0,
                      200
                    ) || "",
                }}
              ></div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No results found</p>
        )}
      </div>
    </div>
  );
}
