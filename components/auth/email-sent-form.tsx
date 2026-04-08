"use client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface EmailSentFormProps {
  resendMail?: boolean;
}
export const EmailSentForm = ({ resendMail }: EmailSentFormProps) => {
  return (
    <form className="flex w-full flex-col gap-5">
      {resendMail && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Email</label>
            <Input type="email" placeholder="Enter your email" />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <Button
          type="submit"
          variant="default"
          href="/auth/login"
          size="default"
          className="w-full"
        >
          Back to login
        </Button>
      </div>
    </form>
  );
};
