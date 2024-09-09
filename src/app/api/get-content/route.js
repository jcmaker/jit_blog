import axios from "axios";
import { db } from "fbManager";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import LZString from "lz-string";

export async function GET() {
  try {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const postsWithContent = await Promise.all(
      posts.map(async (post) => {
        try {
          // Firebase Storage에서 content URL로 파일 다운로드
          const response = await axios.get(post.contentURL);

          // 받은 내용을 압축 해제 (LZ-string 사용)
          const decompressedContent =
            LZString.decompressFromEncodedURIComponent(response.data);

          return {
            ...post,
            content: decompressedContent, // 압축 해제된 content를 추가
          };
        } catch (error) {
          console.error("Error fetching post content:", error);
          return { ...post, content: "Error fetching content" };
        }
      })
    );

    return new Response(JSON.stringify(postsWithContent), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching content:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch content" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
