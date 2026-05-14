"use client";

import { toast } from "sonner";
import { clearAuthStorage } from "./auth-storage";

let didNotify = false;

export const handleAuthFailure = (
  message = "Your session expired. Please sign in again."
) => {
  if (typeof window === "undefined") return;
  if (!didNotify) {
    toast.error(message);
    didNotify = true;
  }
  clearAuthStorage();
  window.location.assign("/auth/login?reason=session_expired");
};
