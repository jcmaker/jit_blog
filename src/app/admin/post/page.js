"use client";
import React, { useState, useRef, useEffect } from "react";
import { db, storage } from "fbManager";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage에서 제공하는 함수들
import { collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import axios from "axios";
import { AdminNav } from "@/components/adminNav";
import Image from "next/image";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import LZString from "lz-string";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation"; // Import useRouter for client-side navigation

function Postpage() {
  const [value, setValue] = useState("");
  const [thumbnailURL, setThumbnailURL] = useState("");
  const [mainTitle, setMainTitle] = useState("");
  const [selectedTags, setSelectedTags] = useState([]); // 선택된 태그 상태
  const [checkPrivate, setCheckPrivate] = useState(false);
  const [tags, setTags] = useState([]); // Firestore에서 불러온 태그 목록
  const [errorMessage, setErrorMessage] = useState(""); // 오류 메시지 상태
  const [totalBytes, setTotalBytes] = useState(0); // 이미지 크기를 저장할 상태
  const [charCount, setCharCount] = useState(0); // 글자 수 저장 상태
  const quillRef = useRef(null); // ReactQuill 인스턴스를 참조하기 위한 ref
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    fetchTags();
  }, []);

  // Firestore에서 태그 목록 불러오기
  const fetchTags = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "tags"));
      const tagsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTags(tagsArray);
    } catch (error) {
      console.error("Error fetching tags: ", error);
    }
  };

  // 이미지 업로드 핸들러
  const handleThumbnailChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileSize = file.size; // 파일 크기 (바이트 단위)
      setTotalBytes((prevTotal) => prevTotal + fileSize);
      const storageRef = ref(storage, `thumbnails/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setThumbnailURL(url);
    }
  };

  // API를 통해 데이터 전송
  const saveContent = async (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

    // 제목 또는 내용이 비어 있으면 제출을 막고 에러 메시지 표시
    if (!mainTitle.trim()) {
      setErrorMessage("Main title is required");
      return;
    }

    const editor = quillRef.current.getEditor();
    if (editor.getText().trim().length === 0) {
      setErrorMessage("Content is required");
      return;
    }

    setErrorMessage(""); // 모든 조건이 충족되면 에러 메시지를 지움
    const compressedContent = LZString.compressToEncodedURIComponent(value);
    if (user) {
      try {
        // API 요청 보내기
        const response = await axios.post("/api/save-content", {
          mainTitle,
          thumbnail: thumbnailURL,
          content: compressedContent, // content 데이터 전송
          tags: selectedTags,
          checkPrivate,
        });

        if (response.status === 200) {
          alert("Content saved successfully!");
          router.push("/"); // Use router.push for client-side navigation
        }
      } catch (error) {
        console.error("Error saving content:", error);
      }
    } else {
      console.error("User is not authenticated");
    }
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: "1" }, { header: "2" }, { font: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
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
    "code-block",
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
    setCharCount(content.length);
  };

  const handleTagSelect = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag)); // 선택 해제
    } else {
      setSelectedTags([...selectedTags, tag]); // 선택
    }
  };

  const handleCheckPrivate = () => {
    setCheckPrivate(!checkPrivate);
  };

  return (
    <main className="flex flex-1 min-h-screen  flex-col items-center p-4 pt-8">
      <div className="shine -z-10 absolute inset-0" role="presentation"></div>
      <div className="mb-16">
        <AdminNav />
      </div>
      <form type="submit" onSubmit={saveContent}>
        <Input
          type="text"
          placeholder="Main Title"
          value={mainTitle}
          onChange={(e) => setMainTitle(e.target.value)}
          required
        />
        <Input
          type="file"
          accept="image/*"
          className="w-full p-2 mb-4"
          onChange={handleThumbnailChange}
          required
        />
        <div className="items-top flex space-x-2 my-5">
          <Input
            type="checkbox"
            id="privatePost"
            onChange={handleCheckPrivate}
            className="w-5 flex items-start justify-start"
          />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="privatePost"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Private Post
            </Label>
            <p className="text-sm text-muted-foreground">
              Make your post Private
            </p>
          </div>
        </div>
        <div className="mb-5">
          {tags.map((tag) => (
            <Badge
              key={tag.id}
              type="button"
              onClick={() => handleTagSelect(tag.name)}
              className={`p-2 m-1 border ${
                selectedTags.includes(tag.name)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {tag.name}
            </Badge>
          ))}
        </div>
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
          ref={quillRef}
          value={value}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          theme="snow"
          className="bg-slate-900 text-white max-w-4xl"
        />
        <div className="mt-4">
          <p>총 글자 수: {charCount}</p>
          <p>이미지 총 용량: {(totalBytes / 1024).toFixed(2)} KB</p>
        </div>
        <Button onClick={saveContent}>Save Content</Button>
      </form>
    </main>
  );
}

export default Postpage;
