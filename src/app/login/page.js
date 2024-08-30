"use client";
import { Button } from "@/components/ui/button";
import {
  signInWithFacebook,
  signInWithGitHub,
  signInWithGoogle,
} from "./authMethods";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChromeIcon, FacebookIcon, GithubIcon } from "lucide-react";

function LoginPage() {
  const router = useRouter(); // useRouter 훅 사용

  const handleLogin = async (loginMethod) => {
    try {
      await loginMethod();
      router.push("/"); // 로그인 성공 시 메인 페이지로 리디렉트
    } catch (error) {
      console.error("로그인 오류:", error);
    }
  };

  return (
    <div className="w-full lg:grid h-screen lg:grid-cols-2 pt-[80px] lg:pt-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Sign in to your account using one of the following options:
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleLogin(signInWithGoogle)}
          >
            <ChromeIcon className="mr-2 h-5 w-5" />
            <span>Login with Google</span>
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleLogin(signInWithFacebook)}
          >
            <FacebookIcon className="mr-2 h-5 w-5" />
            <span>Login with Facebook</span>
          </Button>
          <Button
            variant="outline"
            className="w-full "
            onClick={() => handleLogin(signInWithGitHub)}
          >
            <GithubIcon className="mr-2 h-5 w-5" />
            <span>Login with Github</span>
          </Button>
        </div>
      </div>
      <div className="hidden bg-muted h-full w-full lg:flex justify-center items-center">
        <Image
          src="/jit_header.png"
          alt="Image"
          width={80}
          height={80}
          className=" object-cover "
        />
      </div>
    </div>
  );
}

export default LoginPage;
