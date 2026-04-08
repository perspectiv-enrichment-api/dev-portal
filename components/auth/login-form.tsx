"use client";

import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SocialButton } from "../ui/social-button";

export const LoginForm = () => {
  return (
    <form className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-4">
        <label className="text-sm font-medium">Email</label>
        <Input type="email" placeholder="Enter your email" />
        <label className="text-sm font-medium">Password</label>
        <Input type="password" placeholder="••••••••" />
      </div>

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
        >
          Sign in
        </Button>
        <SocialButton social="google" size="lg" className="w-full bg-white">
          Sign in with Google
        </SocialButton>
      </div>
    </form>
  );
};
