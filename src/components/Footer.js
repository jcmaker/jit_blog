import { Github, Twitter, Rss } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="text-gray-300 py-8 mt-40 w-5/6 bottom-0">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold text-white mb-2">
              <Image
                src="/jit_header.png"
                alt="Image"
                width={50} // 원하는 너비
                height={50} // 원하는 높이
                style={{ width: "auto", height: "auto" }} // 비율 유지
              />
            </h2>
            <p className="text-sm">&#34;Records of My JITs, 내 짓거리들&#34;</p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-primary transition-colors">
              <Github size={24} />
              <span className="sr-only">GitHub</span>
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              <Twitter size={24} />
              <span className="sr-only">Twitter</span>
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              <Rss size={24} />
              <span className="sr-only">RSS Feed</span>
            </a>
          </div>
        </div>
        <div className="mt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} JIT All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
