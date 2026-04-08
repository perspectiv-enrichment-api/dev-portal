"use client";

import { Button } from "../ui/button";
export const PasswordChangedForm = () => {
  return (
    <form className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-3">
        <Button
          type="submit"
          variant="default"
          size="default"
          className="w-full"
        >
          Back to login
        </Button>
      </div>
    </form>
  );
};
