"use client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const ForgotPasswordForm = () => {
  return (
    <form className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Email</label>
          <Input type="email" placeholder="Enter your email" />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Button type="submit" variant="default" size="default" className="w-full">
          Submit
        </Button>
      </div>
    </form>
  );
};
