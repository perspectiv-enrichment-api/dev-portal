"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { authApi } from "@/lib/api";

export const ForgotPasswordForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.forgotPassword({ email });
      router.push(`/auth/email-sent?email=${encodeURIComponent(email)}`);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Could not send reset instructions",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex w-full flex-col gap-5" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Email</label>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex flex-col gap-3">
        <Button
          type="submit"
          variant="default"
          size="default"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Sending…" : "Submit"}
        </Button>
      </div>
    </form>
  );
};
