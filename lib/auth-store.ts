"use client";

import { authApi, type Tokens, type User } from "./api";

const ACCESS_KEY = "pv_access";
const REFRESH_KEY = "pv_refresh";
const USER_KEY = "pv_user";

export function dicebearUrl(seed: string) {
  return `https://api.dicebear.com/9.x/notionists-neutral/svg?seed=${encodeURIComponent(seed)}`;
}

export const authStore = {
  save(tokens: Tokens, user: User) {
    localStorage.setItem(ACCESS_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_KEY);
  },

  getUser(): User | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  },

  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  },

  /** Returns a valid access token, refreshing if needed. Throws if unauthenticated. */
  async token(): Promise<string> {
    const access = localStorage.getItem(ACCESS_KEY);
    if (access) return access;

    const refresh = localStorage.getItem(REFRESH_KEY);
    if (!refresh) throw new Error("Not authenticated");

    const { tokens } = await authApi.refresh(refresh);
    const user = authStore.getUser()!;
    authStore.save(tokens, user);
    return tokens.accessToken;
  },
};
