"use client";

import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        // API 응답이 성공이 아닌 경우
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();
      console.log("Search results:", result);
      onSearch(result.posts); // 부모 컴포넌트에 검색 결과 전달
    } catch (error) {
      console.error("Error fetching search results:", error);
      onSearch([]); // 검색 실패 시 빈 배열 전달
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search posts..."
        className="border rounded p-2 w-full"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white rounded px-4 py-2"
      >
        Search
      </button>
    </div>
  );
}
