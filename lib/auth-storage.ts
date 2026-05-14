const ACCESS_KEY = "pv_access";
const REFRESH_KEY = "pv_refresh";
const USER_KEY = "pv_user";

export const readAccessToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_KEY);
};

export const readRefreshToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
};

export const readUserRaw = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USER_KEY);
};

export const writeTokens = (tokens: {
  accessToken: string;
  refreshToken: string;
}) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
};

export const writeUserRaw = (userRaw: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, userRaw);
};

export const clearAuthStorage = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
};
