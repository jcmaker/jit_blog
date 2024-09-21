"use client";
import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "fbManager";
import { AdminNav } from "@/components/adminNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

function TagsPage() {
  const [newTag, setNewTag] = useState(""); // 새로운 태그 입력 상태
  const [tags, setTags] = useState([]); // 태그 목록 상태

  // 페이지 로드 시 태그 목록 가져오기
  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchTags();
    }
  }, []);

  // Firestore에서 태그 목록 가져오기
  const fetchTags = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "tags"));
      const tagsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTags(tagsArray);
    } catch (error) {
      toast.error("This is an error!", error);
    }
  };

  // 태그 추가 핸들러
  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!newTag.trim()) return;

    // 입력된 태그를 소문자로 변환하여 저장
    const formattedTag = newTag.trim().toLowerCase();

    try {
      await addDoc(collection(db, "tags"), { name: formattedTag });
      setNewTag(""); // 입력란 초기화
      fetchTags(); // 태그 목록 업데이트
    } catch (error) {
      toast.error("This is an error!", error);
    }
  };

  // 태그 삭제 핸들러
  const handleDeleteTag = async (id) => {
    try {
      await deleteDoc(doc(db, "tags", id));
      fetchTags(); // 태그 목록 업데이트
    } catch (error) {
      toast.error("This is an error!", error);
    }
  };

  return (
    <main className="flex flex-1 min-h-screen flex-col items-center p-4 pt-8">
      <div className="shine -z-10 absolute inset-0" role="presentation"></div>
      <div>
        <AdminNav className="mb-12" />
      </div>
      <form className="mb-4 flex items-center">
        <Input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Enter new tag"
          className="border p-2 rounded-lg"
        />
        <Button
          onClick={handleAddTag}
          className="ml-2 bg-blue-500 text-white p-2 rounded-lg"
        >
          Add Tag
        </Button>
      </form>

      <div className="flex w-96 items-start justify-center h-16 flex-wrap">
        {tags.map((tag) => (
          <Badge
            key={tag.id}
            className="flex justify-between items-center text-white m-1"
          >
            <span className="mr-6 text-xl">#{tag.name}</span>
            <button
              onClick={() => handleDeleteTag(tag.id)}
              className="text-slate-200"
            >
              <X className="w-6 h-6" />
            </button>
          </Badge>
        ))}
      </div>
    </main>
  );
}

export default TagsPage;
