"use client";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const PostCard = ({ post }) => {
  return (
    <Link
      href={`/article/${post.id}`}
      key={post.id}
      className="post w-full max-w-3xl mb-8"
    >
      <div className="rounded-2xl overflow-hidden shadow-lg dark:bg-[#11161e] bg-slate-100 border dark:border-slate-700">
        <div className="relative w-full h-72">
          {/* 이미지 컨테이너 설정 */}
          <Image
            src={post.thumbnail}
            alt="thumbnail"
            layout="fill"
            objectFit="cover" // 이미지가 컨테이너를 꽉 채우도록 설정
            className="rounded-t-lg" // 모서리 둥글게 처리
          />
        </div>
        <div className="p-4 flex items-center">
          <Avatar className="flex items-center justify-center w-14 h-14 rounded-xl">
            <AvatarImage
              src={
                "https://lh3.googleusercontent.com/a/ACg8ocI73C892jeYmjEtpdDikqLoXqr--5Cfww0IGuOD86s6lcyQrBgW=s96-c"
              }
            />
          </Avatar>
          <div className="ml-4">
            <h1 className="md:text-2xl text-xl font-semibold dark:text-slate-300 mb-2">
              {post.mainTitle}
            </h1>
            <div className="flex w-full items-center">
              <p className="flex-2 flex justify-start items-center mr-4 text-xs dark:text-slate-400">
                Justin Cho
              </p>
              <p className="text-xs text-slate-500">
                {post.createdAt
                  ? new Date(post.createdAt.seconds * 1000).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )
                  : "Unknown date"}
              </p>
              {/* <span className="text-xs text-slate-500 flex items-center ml-4">
                <EyeIcon className="mr-1" /> {post.views}
              </span> */}
            </div>
          </div>
          <div className="hidden md:flex md:flex-wrap md:flex-1 gap-2 items-center justify-end mt-1">
            {post.tags && post.tags.length > 0
              ? post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-blue-600 text-xs px-2 py-1 rounded-lg"
                  >
                    #{tag}
                  </span>
                ))
              : null}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
