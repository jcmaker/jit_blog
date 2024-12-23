"use client";
import { AdminNav } from "@/components/adminNav";
import Tiptap from "@/components/Tiptap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import { supabase } from "../../../../supabaseClient";
import Image from "next/image";
import LZString from "lz-string"; // lz-string 추가

function Postpage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState(null); // 이미지 파일 상태
  const [thumbnailPreview, setThumbnailPreview] = useState(null); // 미리보기 URL
  const [tags, setTags] = useState([]); // 전체 태그 목록
  const [selectedTags, setSelectedTags] = useState([]); // 선택된 태그 목록
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // 페이지 로드 시 태그 가져오기
  useEffect(() => {
    const fetchTags = async () => {
      const { data, error } = await supabase.from("tags").select("*");
      if (error) {
        console.error("Error fetching tags:", error.message);
      } else {
        setTags(data);
      }
    };
    fetchTags();
  }, []);

  // 이미지 파일 선택 시 처리
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file); // 선택된 파일 상태 저장
    setThumbnailPreview(URL.createObjectURL(file)); // 로컬 미리보기 URL 생성
  };

  // 태그 선택/해제 핸들러
  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag)); // 선택 해제
    } else {
      setSelectedTags([...selectedTags, tag]); // 태그 선택
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let thumbnailUrl = null;

      // 1. Thumbnail 업로드
      if (thumbnail) {
        const { data, error } = await supabase.storage
          .from("thumbnails") // 버킷 이름
          .upload(`thumbnails/${Date.now()}_${thumbnail.name}`, thumbnail);

        if (error) {
          console.error("Error uploading thumbnail:", error.message);
          setError("Thumbnail upload failed");
          return;
        }

        thumbnailUrl = data.path; // 업로드된 이미지 경로 저장
      }

      // 2. Content 압축
      const compressedContent = LZString.compressToEncodedURIComponent(content);

      // 3. 게시글 데이터 삽입
      const { data, error: insertError } = await supabase.from("posts").insert([
        {
          title,
          content: compressedContent, // 압축된 컨텐츠 저장
          thumbnail: thumbnailUrl, // 썸네일 경로 저장
          tag: selectedTags, // 선택된 태그 목록 저장
        },
      ]);

      if (insertError) {
        console.error("Error inserting data:", insertError.message);
        setError(insertError.message);
        setSuccess(false);
        return;
      }

      // 성공 시 상태 초기화
      setError(null);
      setSuccess(true);
      setTitle("");
      setContent("");
      editor.chain().setContent("").run();
      setThumbnail(null);
      setThumbnailPreview(null);
      setSelectedTags([]);
    } catch (err) {
      console.error("Error during submission:", err.message);
      setError("Submission failed");
    }
  };

  return (
    <div className="p-6 w-full h-full">
      <header className="admin-header">
        <AdminNav />
      </header>
      <main className="flex flex-col w-full h-full justify-center">
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Main Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mb-4"
          />
          <Input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange} // 파일 선택 이벤트 처리
            required
            className="w-full p-2 mb-4"
          />
          {thumbnailPreview && (
            <div className="mb-4">
              <p>Thumbnail Preview:</p>
              <Image
                src={thumbnailPreview}
                alt="Thumbnail Preview"
                className="max-w-xs rounded border"
                width={600}
                height={600}
              />
            </div>
          )}
          <Tiptap value={content} onChange={setContent} />
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag) => (
              <button
                type="button"
                key={tag.id}
                onClick={() => toggleTag(tag.tag)} // 태그 선택/해제
                className={`px-3 py-1 rounded-full ${
                  selectedTags.includes(tag.tag)
                    ? "bg-blue-500 text-white"
                    : "bg-secondary"
                }`}
              >
                {tag.tag}
              </button>
            ))}
          </div>
          <Button className="mt-12" type="submit">
            Submit
          </Button>
        </form>
      </main>
    </div>
  );
}

export default Postpage;
