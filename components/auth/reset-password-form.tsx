"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const ResetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const hasMinLength = password.length >= 8;
  const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);

  return (
    <form className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">New password</label>
          <Input
            type="password"
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Confirm new password</label>
          <Input type="password" placeholder="••••••••" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        {[
          { met: hasMinLength, label: "Must be at least 8 characters" },
          { met: hasSpecialChar, label: "Must contain one special character" },
        ].map(({ met, label }) => (
          <div key={label} className="flex items-center gap-2">
            <div className="flex size-4 items-center justify-center rounded-full border border-gray-300">
              {met && (
                <svg
                  className="size-2.5 text-gray-300"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <Button
          type="submit"
          variant="default"
          size="default"
          className="w-full"
        >
          Reset Password
        </Button>
      </div>
    </form>
  );
};
