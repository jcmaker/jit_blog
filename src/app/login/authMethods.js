"use client";
import { auth } from "fbManager";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";

// Google 로그인 메서드
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    router.push("/"); // 로그인 성공 시 홈 페이지로 이동
    return result.user;
  } catch (error) {
    toast.error("This is an error in Google Login!", error);
  }
};

// Facebook 로그인 메서드
export const signInWithFacebook = async () => {
  const provider = new FacebookAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    toast.error("This is an error in Facebook Login!", error);
  }
};

// GitHub 로그인 메서드
export const signInWithGitHub = async () => {
  const provider = new GithubAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    toast.error("This is an error in Github Login!", error);
  }
};
