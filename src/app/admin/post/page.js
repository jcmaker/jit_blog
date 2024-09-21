"use client";
import React, { useState, useRef, useEffect } from "react";
import { db, storage } from "fbManager";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { AdminNav } from "@/components/adminNav";
import Image from "next/image";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import LZString from "lz-string";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import ReactQuill
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
// Import styles for ReactQuill after dynamic import
import "react-quill/dist/quill.snow.css";

function Postpage() {
  const [value, setValue] = useState("");
  const [thumbnailURL, setThumbnailURL] = useState("");
  const [mainTitle, setMainTitle] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [checkPrivate, setCheckPrivate] = useState(false);
  const [tags, setTags] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [totalBytes, setTotalBytes] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const quillRef = useRef(null);
  const router = useRouter();
  const auth = getAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (!user || user.uid !== process.env.NEXT_PUBLIC_ADMIN_UID) {
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchTags();
    }
  }, []);

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

  const handleThumbnailChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileSize = file.size;
      setTotalBytes((prevTotal) => prevTotal + fileSize);
      const storageRef = ref(storage, `thumbnails/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setThumbnailURL(url);
    }
  };

  const saveContent = async (e) => {
    e.preventDefault();

    if (!mainTitle.trim()) {
      setErrorMessage("Main title is required");
      return;
    }

    const editor = quillRef.current?.getEditor();
    if (editor?.getText().trim().length === 0) {
      setErrorMessage("Content is required");
      return;
    }

    setErrorMessage("");

    const compressedContent = LZString.compressToEncodedURIComponent(value);

    const contentBlob = new Blob([compressedContent], {
      type: "text/plain;charset=utf-8",
    });

    if (user) {
      try {
        const storageRef = ref(storage, `content/${Date.now()}_content.txt`);
        await uploadBytes(storageRef, contentBlob);
        const contentURL = await getDownloadURL(storageRef);

        await addDoc(collection(db, "posts"), {
          mainTitle,
          thumbnail: thumbnailURL,
          contentURL,
          tags: selectedTags,
          checkPrivate,
          createdAt: serverTimestamp(),
          views: 0,
        });

        toast.success("Successfully posted!");
        router.push("/");
      } catch (error) {
        toast.error("This is an error!", error);
      }
    } else {
      toast.error("User is not authenticated");
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
        ["clean"],
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
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleCheckPrivate = () => {
    setCheckPrivate(!checkPrivate);
  };

  return user ? (
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
  ) : (
    <p>Loading...</p>
  );
}

export default Postpage;
