"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuthFooter } from "@/components/auth/auth-footer";
import { AuthHeader } from "@/components/auth/auth-header";
import { LoginForm } from "@/components/auth/login-form";

const SessionExpiredBanner = () => {
  const params = useSearchParams();
  const [showSessionExpired, setShowSessionExpired] = useState(false);

  useEffect(() => {
    if (params.get("reason") === "session_expired") {
      setShowSessionExpired(true);
      const timer = window.setTimeout(() => {
        setShowSessionExpired(false);
      }, 5000);
      return () => window.clearTimeout(timer);
    }
  }, [params]);

  if (!showSessionExpired) return null;

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      Your session expired. Please sign in again.
    </div>
  );
};

export default function LoginPage() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8">
      <Suspense fallback={null}>
        <SessionExpiredBanner />
      </Suspense>
      <AuthHeader
        imageSrc="/images/logos/logo.svg"
        title="Log in to your account"
        subtitle="Welcome back! Please enter your details."
      />
      <LoginForm />
      <AuthFooter
        label="Don't have an account?"
        linkLabel="Sign up"
        href="/auth/register"
      />
    </div>
  );
}
