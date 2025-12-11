"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CallbackPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get("token");

    if (token) {
      localStorage.setItem("access_token", token);
      router.push("/chat");
    } else {
      router.push("/?error=missing_token");
    }
  }, [params, router]);

  return (
    <div className="h-screen flex items-center justify-center text-xl">
      Signing you in...
    </div>
  );
}
