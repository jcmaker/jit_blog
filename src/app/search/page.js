"use client";
import { useState } from "react";
// import { searchPosts } from "./api";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = await searchPosts(query);
    setResults(data);

    setLoading(false);
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts..."
          className="p-2 border rounded-md w-full"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded-md">
          Search
        </button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="results mt-4">
          {results.map((post) => (
            <div
              key={post.id}
              className="result-item p-4 border rounded-md mb-2"
            >
              <h2 className="font-bold text-lg">{post.title}</h2>
              <p className="text-gray-500">{post.content.slice(0, 100)}...</p>
              <span className="text-sm text-gray-400">{post.created_at}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
