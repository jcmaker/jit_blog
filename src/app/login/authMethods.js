"use client";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../../fbManager"; // firebase.js에서 초기화된 auth 모듈을 가져옵니다.

// Google 로그인 메서드
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    router.push("/"); // 로그인 성공 시 홈 페이지로 이동
    return result.user;
  } catch (error) {
    console.error("Google 로그인 오류:", error);
  }
};

// Facebook 로그인 메서드
export const signInWithFacebook = async () => {
  const provider = new FacebookAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Facebook 로그인 오류:", error);
  }
};

// GitHub 로그인 메서드
export const signInWithGitHub = async () => {
  const provider = new GithubAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("GitHub 로그인 오류:", error);
  }
};
