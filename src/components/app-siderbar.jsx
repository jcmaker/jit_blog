"use client";
import {
  Home,
  Laugh,
  LogIn,
  LogOut,
  MoonIcon,
  Search,
  Settings,
  SunIcon,
  Tag,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { useAuth } from "@/app/auth/AuthContext";
import { supabase } from "../../supabaseClient";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

export function AppSidebar() {
  const { session, loading } = useAuth(); // AuthContext로부터 session과 loading 상태 가져오기
  const { theme, setTheme } = useTheme();
  const router = new useRouter();
  const avatarUrl = session?.user?.user_metadata?.avatar_url || ""; // 아바타 URL 가져오기

  // 로딩 중일 때는 빈 화면 또는 로딩 표시
  if (loading) {
    return null; // 또는 로딩 스피너를 표시할 수 있습니다.
  }

  const items = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: session ? "Logout" : "Login", // 로그인 상태에 따라 이름 변경
      url: session ? "#" : "/auth/login", // 로그아웃 시 링크를 "#"으로 설정
      icon: session ? LogOut : LogIn, // 아이콘 변경
      onClick: session
        ? async () => {
            await supabase.auth.signOut(); // 로그아웃 기능 추가
            router.push("/auth/login");
          }
        : null, // 로그인 시에는 onClick 이벤트 없음
    },
    {
      title: "Tag",
      url: "/",
      icon: Tag,
    },
    {
      title: "Search",
      url: "/search",
      icon: Search,
    },
    {
      title: theme === "dark" ? "Light Mode" : "Dark Mode", // 테마에 따라 이름 변경
      url: "#",
      icon: theme === "dark" ? SunIcon : MoonIcon, // 현재 테마에 따라 아이콘 변경
      onClick: () => setTheme(theme === "dark" ? "light" : "dark"), // 클릭 시 테마 토글
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <Link href="/">
        <SidebarHeader className="w-full flex items-center justify-center font-bold text-slate-200 dark:text-neutral-800 jit_logo bg-neutral-900 dark:bg-slate-200 rounded-b-sm">
          JIT
        </SidebarHeader>
      </Link>
      <SidebarContent>
        <SidebarGroup className="group-data-[icon]:hidden">
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild onClick={item.onClick}>
                    <Link href={item.url} className="flex items-center w-full">
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex justify-center items-center">
        <Avatar>
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>
            <Laugh className="text-gray-500" />
          </AvatarFallback>
        </Avatar>
      </SidebarFooter>
    </Sidebar>
  );
}
