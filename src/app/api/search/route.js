// pages/api/search.js
import { supabase } from "../../../../supabaseClient";

export default async function handler(req, res) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const { data, error } = await supabase
      .from("posts")
      .select("id, title, content, created_at, thumbnail")
      .textSearch("title || content", query, { type: "websearch" });

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
