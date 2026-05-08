"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authStore } from "@/lib/auth-store";

function OAuthCallbackHandler() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const userRaw = params.get("user");

    if (accessToken && refreshToken && userRaw) {
      try {
        const user = JSON.parse(userRaw);
        authStore.save({ accessToken, refreshToken }, user);
        router.replace(user.org_id ? "/dashboard" : "/auth/onboarding");
      } catch {
        router.replace("/auth/login");
      }
    } else {
      router.replace("/auth/login");
    }
  }, [params, router]);

  return null;
}

export default function OAuthCallbackPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Suspense fallback={<p className="text-muted-foreground">Signing you in…</p>}>
        <OAuthCallbackHandler />
      </Suspense>
      <p className="text-muted-foreground">Signing you in…</p>
    </div>
  );
}
