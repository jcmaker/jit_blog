import { db } from "fbManager";
import { doc, deleteDoc } from "firebase/firestore";

export async function DELETE(req, { params }) {
  const { postId } = params; // This gets the dynamic postId from the URL
  try {
    const postDoc = doc(db, "posts", postId);
    await deleteDoc(postDoc);
    return new Response(
      JSON.stringify({ message: "Post deleted successfully!" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error deleting post:", error);
    return new Response(JSON.stringify({ error: "Failed to delete post" }), {
      status: 500,
    });
  }
}
