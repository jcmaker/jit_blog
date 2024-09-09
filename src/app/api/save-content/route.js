import { db, storage } from "fbManager";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function POST(req) {
  try {
    const { mainTitle, thumbnail, content, tags } = await req.json();

    // 1. Firebase Storage에 content 저장
    const contentBlob = new Blob([content], {
      type: "text/plain;charset=utf-8",
    });
    const storageRef = ref(storage, `content/${Date.now()}_content.txt`);
    await uploadBytes(storageRef, contentBlob);
    const contentURL = await getDownloadURL(storageRef);

    // 2. Firestore에 content URL을 저장
    const docRef = await addDoc(collection(db, "posts"), {
      mainTitle,
      thumbnail,
      contentURL, // 대용량 content 대신 URL만 저장
      tags,
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
