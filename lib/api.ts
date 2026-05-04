const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function request<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, ...init } = options;
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.status_message ?? data.message ?? "Request failed"), { status: res.status, data });
  return data as T;
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  org_id: string | null;
  created_at?: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: Tokens;
}

export interface Project {
  id: string;
  org_id: string;
  name: string;
  environment: string;
  status: string;
  use_case: string;
  project_icon_url: string;
  created_at: string;
  updated_at?: string;
}

export interface ApiKey {
  id: string;
  label: string;
  key_prefix: string;
  org_id: string | null;
  last_used_at: string | null;
  created_at: string;
  revoked: boolean;
  key?: string; // only on create
}

export interface UsageRecord {
  id: string;
  created_at: string;
  merchant_name: string;
  status_code: number;
  latency_ms: number;
  country: string;
  key_id: string;
}

export interface UsageSummary {
  total_calls: number;
  match_rate: number;
  avg_latency: number;
  daily_volume: { date: string; count: number }[];
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  register: (body: { first_name: string; last_name: string; email: string; country: string; company_name: string; website_url?: string; company_size: string; password: string }) =>
    request<{ data: { user: User } }>("/v1/auth/register", { method: "POST", body: JSON.stringify(body) }),

  login: async (body: { email: string; password: string }): Promise<AuthResponse> => {
    const res = await request<{ data: { user: User; accessToken: string; refreshToken: string } }>("/v1/auth/login", { method: "POST", body: JSON.stringify(body) });
    return { user: res.data.user, tokens: { accessToken: res.data.accessToken, refreshToken: res.data.refreshToken } };
  },

  verifyEmail: async (body: { email: string; code: string }): Promise<AuthResponse> => {
    const res = await request<{ data: { user: User; accessToken: string; refreshToken: string } }>("/v1/auth/verify-email", { method: "POST", body: JSON.stringify(body) });
    return { user: res.data.user, tokens: { accessToken: res.data.accessToken, refreshToken: res.data.refreshToken } };
  },

  resendOtp: (body: { email: string }) =>
    request<void>("/v1/auth/resend-otp", { method: "POST", body: JSON.stringify(body) }),

  refresh: (refreshToken: string) =>
    request<{ tokens: Tokens }>("/v1/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    }),
};

// ── Users ────────────────────────────────────────────────────────────────────

export const usersApi = {
  me: (token: string) => request<{ user: User }>("/v1/users/me", { token }),

  update: (token: string, body: { name?: string; password?: string }) =>
    request<{ user: User }>("/v1/users/me", { method: "PATCH", token, body: JSON.stringify(body) }),

  delete: (token: string) =>
    request<void>("/v1/users/me", { method: "DELETE", token }),
};

// ── API Keys ─────────────────────────────────────────────────────────────────

export const keysApi = {
  list: (token: string) => request<{ keys: ApiKey[] }>("/v1/keys", { token }),

  create: (token: string, label: string) =>
    request<{ key: ApiKey }>("/v1/keys", {
      method: "POST",
      token,
      body: JSON.stringify({ label }),
    }),

  revoke: (token: string, keyId: string) =>
    request<void>(`/v1/keys/${keyId}`, { method: "DELETE", token }),
};

// ── Projects ─────────────────────────────────────────────────────────────────

export const projectsApi = {
  list: (token: string) =>
    request<{ data: { projects: Project[] } }>("/v1/projects", { token }),

  get: (token: string, projectId: string) =>
    request<{ data: { project: Project } }>(`/v1/projects/${projectId}`, { token }),

  create: (token: string, body: { name: string; environment: string; use_case: string; status?: string }) =>
    request<{ data: { project: Project } }>("/v1/projects", { method: "POST", token, body: JSON.stringify(body) }),

  update: (token: string, projectId: string, body: { name?: string; environment?: string; status?: string; use_case?: string; project_icon_url?: string }) =>
    request<{ data: { project: Project } }>(`/v1/projects/${projectId}`, { method: "PATCH", token, body: JSON.stringify(body) }),

  delete: (token: string, projectId: string) =>
    request<void>(`/v1/projects/${projectId}`, { method: "DELETE", token }),
};

// ── Usage ────────────────────────────────────────────────────────────────────

export const usageApi = {
  list: (token: string, params?: { page?: number; limit?: number; from?: string; to?: string; key_id?: string }) => {
    const qs = new URLSearchParams(
      Object.entries(params ?? {})
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString();
    return request<{ logs: UsageRecord[]; total: number }>(`/v1/usage${qs ? `?${qs}` : ""}`, { token });
  },

  summary: (token: string) => request<UsageSummary>("/v1/usage/summary", { token }),
};
