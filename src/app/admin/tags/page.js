"use client";
import { useState, useEffect } from "react";
import { AdminNav } from "@/components/adminNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { supabase } from "../../../../supabaseClient";

function TagsPage() {
  const [newTag, setNewTag] = useState(""); // New tag input state
  const [tags, setTags] = useState([]); // Tags list state
  const [error, setError] = useState(null); // Error state

  // Fetch tags on component load
  useEffect(() => {
    fetchTags();
  }, []);

  // Fetch tags from Supabase
  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from("tags")
        .select("id, tag, created_at")
        .order("created_at", { ascending: true }); // Fetch tags ordered by creation date

      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error("Error fetching tags:", error.message);
      setError("Failed to fetch tags");
    }
  };

  // Add new tag
  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!newTag.trim()) return;

    const formattedTag = newTag.trim().toLowerCase(); // Format tag to lowercase

    try {
      const { error } = await supabase
        .from("tags")
        .insert([{ tag: formattedTag }]);
      if (error) throw error;

      setNewTag(""); // Clear input
      fetchTags(); // Refresh tags list
    } catch (error) {
      console.error("Error adding tag:", error.message);
      setError("Failed to add tag");
    }
  };

  // Delete tag
  const handleDeleteTag = async (id) => {
    try {
      const { error } = await supabase.from("tags").delete().eq("id", id);
      if (error) throw error;

      fetchTags(); // Refresh tags list
    } catch (error) {
      console.error("Error deleting tag:", error.message);
      setError("Failed to delete tag");
    }
  };

  return (
    <div className="p-6 w-full">
      <header className="admin-header">
        <AdminNav />
      </header>
      <div className="w-full flex flex-col items-center">
        <form
          className="mb-4 mt-12 flex items-center w-2/5"
          onSubmit={handleAddTag}
        >
          <Input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Enter new tag"
            className="border p-2 rounded-lg"
          />
          <Button
            type="submit"
            className="ml-2 bg-blue-500 text-white p-2 rounded-lg"
          >
            Add Tag
          </Button>
        </form>

        <div className="flex w-96 items-start justify-center h-auto flex-wrap">
          {tags.map((tag) => (
            <Badge
              key={tag.id}
              className="flex justify-between items-center bg-slate-900 text-white m-1 px-3 py-1 rounded-lg"
            >
              <span className="mr-6 text-sm">#{tag.tag}</span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteTag(tag.id);
                }}
                className="text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TagsPage;
