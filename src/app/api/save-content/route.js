import { db } from "fbManager";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req) {
  try {
    const { content } = await req.json(); // 요청에서 JSON 데이터를 추출

    const docRef = await addDoc(collection(db, "posts"), {
      content,
      createdAt: serverTimestamp(),
    });

    return new Response(
      JSON.stringify({ message: "Content saved successfully", id: docRef.id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error saving content:", error.message);
    return new Response(
      JSON.stringify({
        error: "Failed to save content",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
