"use client";
import React, { useState, useRef } from "react";
import { AdminNav } from "@/components/adminNav";
import { storage } from "fbManager";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage에서 제공하는 함수들
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { Button } from "@/components/ui/button";

function Postpage() {
  const [value, setValue] = useState("");
  const quillRef = useRef(null); // ReactQuill 인스턴스를 참조하기 위한 ref

  // 이미지 업로드 핸들러
  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const storageRef = ref(storage, `images/${file.name}`);

      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      const quillEditor = quillRef.current.getEditor(); // Quill 인스턴스에 접근
      const range = quillEditor.getSelection();
      quillEditor.insertEmbed(range.index, "image", url);
    };
  };

  // API를 통해 데이터 전송
  const saveContent = async () => {
    try {
      const response = await axios.post("/api/save-content", {
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
    </main>
  );
}

export default Postpage;
