"use client";
import React, { useState, useRef } from "react";
import { AdminNav } from "@/components/adminNav";
import { storage } from "fbManager";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage에서 제공하는 함수들
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

function Postpage() {
  const [value, setValue] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailURL, setThumbnailURL] = useState("");
  const [mainTitle, setMainTitle] = useState("");
  const quillRef = useRef(null); // ReactQuill 인스턴스를 참조하기 위한 ref

  // 이미지 업로드 핸들러
  const handleThumbnailChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      const storageRef = ref(storage, `thumbnails/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setThumbnailURL(url);
    }
  };

  // API를 통해 데이터 전송
  const saveContent = async () => {
    // API 요청 보내기
    try {
      const response = await axios.post("/api/save-content", {
        mainTitle,
        thumbnail: thumbnailURL,
        content: value,
      });
      if (response.status === 200) {
        alert("Content saved successfully!");
      }
    } catch (error) {
      console.error("Error saving content:", error);
    }
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: "1" }, { header: "2" }, { font: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],
        ["link", "image", "video"],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ["clean"], // Remove formatting button
      ],
    },
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "script",
    "super",
    "sub",
    "color",
    "background",
    "align",
  ];

  const handleChange = (content) => {
    setValue(content);
  };

  return (
    <main className="flex flex-1 min-h-screen flex-col items-center p-16">
      <div className="shine -z-10 absolute inset-0" role="presentation"></div>
      <div>
        <AdminNav />
      </div>
      <form>
        <Input
          type="text"
          placeholder="Main Title"
          value={mainTitle}
          onChange={(e) => setMainTitle(e.target.value)}
        />
        <Input
          type="file"
          accept="image/*"
          className="w-full p-2 mb-4"
          onChange={handleThumbnailChange}
        />
        {thumbnailURL && (
          <Image
            src={thumbnailURL}
            alt="Thumbnail preview"
            className="mb-4"
            width={400}
            height={400}
          />
        )}
        <ReactQuill
          ref={quillRef} // ReactQuill의 ref를 설정
          value={value}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          theme="snow"
          className="bg-slate-900 text-white"
        />
        <Button onClick={saveContent}>Save Content</Button>
      </form>
    </main>
  );
}

export default Postpage;
