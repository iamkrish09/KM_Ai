"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatUI from "@/components/ChatUI";

export default function ChatPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.push("/");    // Not logged in → go back to landing
    }
  }, [router]);

  return (
    <div className="h-screen w-full">
      <ChatUI />
    </div>
  );
}
