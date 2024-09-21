"use client";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";
import { db } from "fbManager";
import { collection, getDocs } from "firebase/firestore";
import { Badge } from "./ui/badge";
import Link from "next/link";

function TagSearch() {
  const [tags, setTags] = useState([]); // Firestore에서 불러온 태그 목록

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
      console.error("Error fetching tags: ", error);
    }
  };

  // ToDo:  onClick goto /article/[tagId]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="bg-none border-none md:w-14 h-14 rounded-xl md:border flex items-center justify-end">
        <Filter className="text-slate-400" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>TAGS</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {tags.map((tag) => (
          <DropdownMenuItem key={tag.id}>
            <Link href={`/posts/${tag.name}`}>
              <Badge>#{tag.name}</Badge>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default TagSearch;
