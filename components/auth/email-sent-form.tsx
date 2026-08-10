"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { authApi } from "@/lib/api";

interface EmailSentFormProps {
  resendMail?: boolean;
}
export const EmailSentForm = ({ resendMail }: EmailSentFormProps) => {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.forgotPassword({ email });
      toast.success("Reset instructions sent again");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not resend email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex w-full flex-col gap-5" onSubmit={handleResend}>
      {resendMail && (
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
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex flex-col gap-3">
        {resendMail ? (
          <Button
            type="submit"
            variant="default"
            size="default"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Sending…" : "Resend email"}
          </Button>
        ) : (
          <Button
            type="button"
            variant="default"
            href="/auth/login"
            size="default"
            className="w-full"
          >
            Back to login
          </Button>
        )}
      </div>
    </form>
  );
};
