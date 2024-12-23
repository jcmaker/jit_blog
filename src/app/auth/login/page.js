"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { supabase } from "../../../../supabaseClient";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(false); // 회원가입/로그인 상태를 관리
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) setError(error.message);
  };

  const handleFacebookLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
    });
    if (error) setError(error.message);
  };

  const handleKakaoLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "kakao",
    });
    if (error) setError(error.message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (newAccount) {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        // options: {
        //   data: {
        //     avatar_url: "https://example.com/default-avatar.png", // 기본 아바타 URL
        //   },
        // },
      });
      setLoading(false);
      if (error) setError(error.message);
      else window.location.href = "/";
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setLoading(false);
      if (error) setError(error.message);
      else window.location.href = "/";
    }
  };

  const toggleAccount = () => setNewAccount(!newAccount);

  return (
    <div className="w-full lg:grid h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">
              {newAccount ? "Sign Up" : "Login"}
            </h1>
            <p className="text-balance text-muted-foreground">
              {newAccount
                ? "Please enter the email below to sign up"
                : "Login to your account"}
            </p>
          </div>

          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "loading..." : newAccount ? "SignUp" : "Login"}
            </Button>

            <div className="flex items-center">
              <Separator className="flex-1 dark:bg-slate-400" />
              <span className="px-2 text-gray-500 dark:text-gray-400">or</span>
              <Separator className="flex-1 dark:bg-slate-400" />
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
            >
              <Image
                src="/google-icon.svg"
                width={20}
                height={20}
                alt="Google"
                className="mr-2 justify-items-start"
              />
              Continue with Google
            </Button>

            <Button
              variant="outline"
              disabled
              className="w-full"
              onClick={handleFacebookLogin}
            >
              <Image
                src="/facebook-icon.svg"
                width={20}
                height={20}
                alt="Facebook"
                className="mr-2 justify-items-start"
              />
              Continue with Facebook
            </Button>

            <Button
              variant="outline"
              className="w-full"
              disabled
              onClick={handleKakaoLogin}
            >
              <Image
                src="/kakao-icon.svg"
                width={20}
                height={20}
                alt="Kakao"
                className="mr-2 justify-items-start"
              />
              Continue with Kakao
            </Button>
          </form>

          {error && <p className="text-red-500">{error}</p>}

          <div className="mt-4 text-center text-sm">
            {newAccount ? "Have an account?" : "Don't have an account?"}{" "}
            <span onClick={toggleAccount} className="underline cursor-pointer">
              {newAccount ? "Sign in" : "Sign up"}
            </span>
          </div>
        </div>
      </div>

      <div className="hidden bg-muted h-full w-full lg:flex justify-center items-center">
        <Image
          src="/jit_v2_logo.png"
          alt="Image"
          width={80}
          height={80}
          className="object-cover hidden dark:inline-block"
        />
        <Image
          src="/jit_v2_logo_black.png"
          alt="Image"
          width={80}
          height={80}
          className="object-cover dark:hidden"
        />
      </div>
    </div>
  );
}

export default LoginPage;
