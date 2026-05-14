"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authStore } from "./auth-store";
import { getAuthChangeEvent } from "./auth-storage";
import type { User } from "./api";

type AuthContextValue = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  setUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const syncUser = () => setUser(authStore.getUser());
    syncUser();

    const authEvent = getAuthChangeEvent();
    window.addEventListener("storage", syncUser);
    window.addEventListener(authEvent, syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener(authEvent, syncUser);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
