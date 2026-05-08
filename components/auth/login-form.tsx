"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SocialButton } from "../ui/social-button";
import Link from "next/link";
import { authApi } from "@/lib/api";
import { authStore } from "@/lib/auth-store";
import { useAuth } from "@/lib/auth-context";

export const LoginForm = () => {
  const router = useRouter();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { user, tokens } = await authApi.login({ email, password });
      authStore.save(tokens, user);
      setUser(user);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex w-full flex-col gap-5" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <label className="text-sm font-medium">Email</label>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label className="text-sm font-medium">Password</label>
        <Input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm">
          <Checkbox />
          Remember for 30 days
        </label>
        <Button href="/auth/forgot-password" variant="link" size="sm">
          Forgot password
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        <Button
          type="submit"
          variant="default"
          size="default"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Signing in…" : "Sign in"}
        </Button>
        <SocialButton
          social="google"
          size="lg"
          className="w-full bg-white h-9 text-sm"
          onClick={() => { window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/oauth/google`; }}
        >
          Continue with Google
        </SocialButton>
      </div>
    </form>
  );
};
