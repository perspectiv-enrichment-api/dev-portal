"use client";

import { authApi, type Tokens, type User } from "./api";
import {
  readAccessToken,
  readRefreshToken,
  readUserRaw,
  writeTokens,
  writeUserRaw,
  clearAuthStorage,
} from "./auth-storage";
import { handleAuthFailure } from "./auth-failure";
const TOKEN_SKEW_SECONDS = 60;

type JwtPayload = {
  exp?: number;
};

const decodeJwt = (token: string): JwtPayload | null => {
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const json = atob(padded);
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
};

const isTokenExpired = (token: string) => {
  const payload = decodeJwt(token);
  if (!payload?.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now + TOKEN_SKEW_SECONDS;
};

export function dicebearUrl(seed: string) {
  return `https://api.dicebear.com/9.x/notionists-neutral/svg?seed=${encodeURIComponent(seed)}`;
}

export const authStore = {
  save(tokens: Tokens, user: User) {
    writeTokens(tokens);
    writeUserRaw(JSON.stringify(user));
  },

  getAccessToken(): string | null {
    return readAccessToken();
  },

  getUser(): User | null {
    const raw = readUserRaw();
    return raw ? (JSON.parse(raw) as User) : null;
  },

  clear() {
    clearAuthStorage();
  },

  /** Returns a valid access token, refreshing if needed. Throws if unauthenticated. */
  async token(): Promise<string> {
    const access = readAccessToken();
    if (access && !isTokenExpired(access)) return access;

    const refresh = readRefreshToken();
    if (!refresh) throw new Error("Not authenticated");

    try {
      const { tokens } = await authApi.refresh(refresh);
      const user = authStore.getUser()!;
      authStore.save(tokens, user);
      return tokens.accessToken;
    } catch (err) {
      authStore.clear();
      handleAuthFailure();
      throw err;
    }
  },
};
