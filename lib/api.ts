import { readRefreshToken, writeTokens } from "./auth-storage";
import { handleAuthFailure } from "./auth-failure";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const refreshTokens = async (): Promise<Tokens | null> => {
  if (typeof window === "undefined") return null;
  const refreshToken = readRefreshToken();
  if (!refreshToken) return null;

  const res = await fetch(`${BASE}/v1/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return null;

  const tokens: Tokens | undefined = data?.data ?? data?.tokens;
  if (!tokens?.accessToken || !tokens?.refreshToken) return null;
  writeTokens(tokens);
  return tokens;
};

async function request<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
  retry = true,
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
  if (res.status === 401 && retry && token) {
    const tokens = await refreshTokens();
    if (tokens) {
      return request(path, { ...options, token: tokens.accessToken }, false);
    }
    handleAuthFailure();
  }
  if (!res.ok)
    throw Object.assign(
      new Error(data.status_message ?? data.message ?? "Request failed"),
      { status: res.status, data },
    );
  return data as T;
}

/** Serializes defined, non-empty params into a `?a=1&b=2` suffix. */
const queryString = (params?: object) => {
  const qs = new URLSearchParams(
    Object.entries(params ?? {})
      .filter(([, v]) => v !== undefined && v !== null && v !== "")
      .map(([k, v]) => [k, String(v)]),
  ).toString();
  return qs ? `?${qs}` : "";
};

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
  project_id?: string | null;
  project_name?: string | null;
  project_environment?: string | null;
  project_status?: string | null;
  project_use_case?: string | null;
  last_used_at: string | null;
  created_at: string;
  revoked: boolean;
  key?: string; // only on create
}

export type MerchantStatus = "verified" | "pending" | "archived";

/** Image types the merchant logo-upload endpoint accepts. */
export const MERCHANT_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
] as const;
export type MerchantImageType = (typeof MERCHANT_IMAGE_TYPES)[number];

export type MerchantLogoKind = "primary" | "alternate" | "category_icon";

export interface Merchant {
  id: string;
  name: string;
  merchant_logo: string | null;
  mcc: string;
  status: MerchantStatus;
  aliases: string[];
  created_at: string;
  updated_at?: string;
}

export interface CreateMerchantInput {
  // Merchant information
  name: string;
  merchant_logo?: string;
  status?: MerchantStatus;
  description?: string;
  // Business information
  website?: string;
  email?: string;
  phone?: string;
  headquarters?: string;
  country?: string; // ISO 3166-1 alpha-2, e.g. "GH"
  founded_year?: number;
  // Branding
  alternate_logos?: string[];
  category_icon?: string;
  brand_colors?: string[];
  // Classification
  industry_group?: string;
  mcc: string;
  mcc_description?: string;
  tags?: string[];
  // Transaction recognition
  aliases?: string[];
}

/** Image fields accept null to clear the current asset. */
export type UpdateMerchantInput = Partial<
  Omit<CreateMerchantInput, "merchant_logo" | "category_icon">
> & {
  merchant_logo?: string | null;
  category_icon?: string | null;
};

/** The full record returned by `GET /merchants/:id`. */
export interface MerchantDetail extends Merchant {
  description?: string | null;
  industry_group?: string | null;
  mcc_description?: string | null;
  tags?: string[];
  website?: string | null;
  email?: string | null;
  phone?: string | null;
  headquarters?: string | null;
  country?: string | null;
  founded_year?: number | null;
  alternate_logos?: string[];
  category_icon?: string | null;
  brand_colors?: string[];
  recognition_confidence?: number | null;
  source?: string | null;
  internal_notes?: string | null;
}

export interface MerchantListParams {
  search?: string;
  page?: number;
  limit?: number;
  status?: MerchantStatus;
  mcc?: string;
  industry_group?: string;
  country?: string;
  source?: string;
  /** Comma-separated, e.g. "coffee,cafe". */
  tags?: string;
}

export type BranchStatus = "active" | "inactive";

export interface Branch {
  id: string;
  merchant_id?: string;
  name: string;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  status: BranchStatus;
  created_at?: string;
  updated_at?: string;
}

export interface CreateBranchInput {
  name: string;
  address?: string;
  city?: string;
  country?: string;
  status?: BranchStatus;
}

export type UpdateBranchInput = Partial<CreateBranchInput>;

export interface Org {
  id: string;
  name: string;
  slug: string;
  website_url?: string | null;
  company_size?: string | null;
  created_at?: string;
}

export interface OrgMember {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at?: string;
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
  register: (body: {
    first_name: string;
    last_name: string;
    email: string;
    country: string;
    company_name: string;
    website_url?: string;
    company_size: string;
    password: string;
  }) =>
    request<{ data: { user: User } }>("/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: async (body: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const res = await request<{
      data: { user: User; accessToken: string; refreshToken: string };
    }>("/v1/auth/login", { method: "POST", body: JSON.stringify(body) });
    return {
      user: res.data.user,
      tokens: {
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      },
    };
  },

  verifyEmail: async (body: {
    email: string;
    code: string;
  }): Promise<AuthResponse> => {
    const res = await request<{
      data: { user: User; accessToken: string; refreshToken: string };
    }>("/v1/auth/verify-email", { method: "POST", body: JSON.stringify(body) });
    return {
      user: res.data.user,
      tokens: {
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      },
    };
  },

  resendOtp: (body: { email: string }) =>
    request<void>("/v1/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  onboarding: (
    token: string,
    body: {
      first_name: string;
      last_name: string;
      country: string;
      company_name: string;
      website_url?: string;
      company_size: string;
    },
  ) =>
    request<{
      data: {
        user: User;
        org: { id: string; name: string };
        accessToken: string;
        refreshToken: string;
      };
    }>("/v1/auth/onboarding", {
      method: "POST",
      token,
      body: JSON.stringify(body),
    }),

  forgotPassword: (body: { email: string }) =>
    request<void>("/v1/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  resetPassword: (body: { token: string; password: string }) =>
    request<void>("/v1/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  refresh: async (refreshToken: string) => {
    const res = await request<{ data: Tokens }>("/v1/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
    return { tokens: res.data };
  },
};

// ── Users ────────────────────────────────────────────────────────────────────

export const usersApi = {
  me: (token: string) => request<{ user: User }>("/v1/users/me", { token }),

  update: (token: string, body: { name?: string; password?: string }) =>
    request<{ user: User }>("/v1/users/me", {
      method: "PATCH",
      token,
      body: JSON.stringify(body),
    }),

  delete: (token: string) =>
    request<void>("/v1/users/me", { method: "DELETE", token }),
};

// ── API Keys ─────────────────────────────────────────────────────────────────

export const keysApi = {
  list: (token: string) =>
    request<{ keys?: ApiKey[]; data?: { keys?: ApiKey[] } }>("/v1/keys", {
      token,
    }).then((res) => ({ keys: res.data?.keys ?? res.keys ?? [] })),

  create: (token: string, label: string, projectId: string) =>
    request<{ key?: ApiKey; data?: { key?: ApiKey } }>("/v1/keys", {
      method: "POST",
      token,
      body: JSON.stringify({ label, project_id: projectId }),
    }).then((res) => {
      const key = res.data?.key ?? res.key;
      if (!key) throw new Error("Key creation returned no key");
      return { key };
    }),

  revoke: (token: string, keyId: string) =>
    request<void>(`/v1/keys/${keyId}`, { method: "DELETE", token }),
};

// ── Projects ─────────────────────────────────────────────────────────────────

export const projectsApi = {
  list: (token: string) =>
    request<{ data: { projects: Project[] } }>("/v1/projects", { token }),

  get: (token: string, projectId: string) =>
    request<{ data: { project: Project } }>(`/v1/projects/${projectId}`, {
      token,
    }),

  create: (
    token: string,
    body: {
      name: string;
      environment: string;
      use_case: string;
      status?: string;
    },
  ) =>
    request<{ data: { project: Project } }>("/v1/projects", {
      method: "POST",
      token,
      body: JSON.stringify(body),
    }),

  update: (
    token: string,
    projectId: string,
    body: {
      name?: string;
      environment?: string;
      status?: string;
      use_case?: string;
      project_icon_url?: string;
    },
  ) =>
    request<{ data: { project: Project } }>(`/v1/projects/${projectId}`, {
      method: "PATCH",
      token,
      body: JSON.stringify(body),
    }),

  /**
   * Uploads a custom project icon and returns its public URL.
   *
   * Mirrors the merchant logo contract: ask for a presigned URL, PUT the raw
   * file straight to storage (no auth header, no JSON envelope — so this
   * bypasses `request()`), then hand the public URL back for the caller to
   * PATCH onto the project.
   */
  uploadIcon: async (
    token: string,
    projectId: string,
    file: File,
  ): Promise<string> => {
    const res = await request<{
      data: { upload_url: string; public_url: string };
    }>(`/v1/projects/${projectId}/icon-upload-url`, {
      method: "POST",
      token,
      body: JSON.stringify({ content_type: file.type }),
    });
    const put = await fetch(res.data.upload_url, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (!put.ok) throw new Error(`Upload failed for ${file.name}`);
    return res.data.public_url;
  },

  delete: (token: string, projectId: string) =>
    request<void>(`/v1/projects/${projectId}`, { method: "DELETE", token }),
};

// ── Merchants (admin) ────────────────────────────────────────────────────────

const isMockSession = () => process.env.NEXT_PUBLIC_MOCK_SESSION === "true";

export const merchantsApi = {
  list: async (
    token: string,
    params?: MerchantListParams,
  ): Promise<{ merchants: Merchant[]; total: number }> => {
    if (isMockSession()) {
      const { mockListMerchants } = await import("./mock-merchants");
      return mockListMerchants(params);
    }
    const res = await request<{
      data: {
        merchants: Merchant[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          total_pages: number;
        };
      };
    }>(`/v1/merchants${queryString(params)}`, { token });
    return {
      merchants: res.data.merchants,
      total: res.data.pagination?.total ?? res.data.merchants.length,
    };
  },

  get: async (token: string, merchantId: string): Promise<MerchantDetail> => {
    if (isMockSession()) {
      const { mockGetMerchant } = await import("./mock-merchants");
      return mockGetMerchant(merchantId);
    }
    const res = await request<{ data: MerchantDetail }>(
      `/v1/merchants/${merchantId}`,
      { token },
    );
    return res.data;
  },

  create: async (
    token: string,
    body: CreateMerchantInput,
  ): Promise<Merchant> => {
    if (isMockSession()) {
      const { mockCreateMerchant } = await import("./mock-merchants");
      return mockCreateMerchant(body);
    }
    const res = await request<{ data: Merchant }>("/v1/merchants", {
      method: "POST",
      token,
      body: JSON.stringify(body),
    });
    return res.data;
  },

  update: async (
    token: string,
    merchantId: string,
    body: UpdateMerchantInput,
  ): Promise<Merchant> => {
    if (isMockSession()) {
      const { mockUpdateMerchant } = await import("./mock-merchants");
      return mockUpdateMerchant(merchantId, body);
    }
    const res = await request<{ data: Merchant }>(
      `/v1/merchants/${merchantId}`,
      { method: "PATCH", token, body: JSON.stringify(body) },
    );
    return res.data;
  },

  /**
   * Uploads one merchant image and returns its public URL.
   *
   * Three steps, per the backend contract: ask for a presigned URL, PUT the
   * raw file straight to storage (no auth header, no JSON envelope — so this
   * bypasses `request()`), then hand the public URL back for the caller to
   * PATCH onto the merchant.
   */
  uploadImage: async (
    token: string,
    merchantId: string,
    file: File,
    kind: MerchantLogoKind,
  ): Promise<string> => {
    if (isMockSession()) {
      const { mockUploadImage } = await import("./mock-merchants");
      return mockUploadImage(file);
    }
    const res = await request<{
      data: { upload_url: string; public_url: string };
    }>(`/v1/merchants/${merchantId}/logo-upload-url`, {
      method: "POST",
      token,
      body: JSON.stringify({ content_type: file.type, kind }),
    });
    const put = await fetch(res.data.upload_url, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (!put.ok) throw new Error(`Upload failed for ${file.name}`);
    return res.data.public_url;
  },

  delete: async (token: string, merchantId: string): Promise<void> => {
    if (isMockSession()) {
      const { mockDeleteMerchant } = await import("./mock-merchants");
      mockDeleteMerchant(merchantId);
      return;
    }
    await request<void>(`/v1/merchants/${merchantId}`, {
      method: "DELETE",
      token,
    });
  },

  addAliases: async (
    token: string,
    merchantId: string,
    aliases: string[],
  ): Promise<string[]> => {
    if (isMockSession()) {
      const { mockChangeAliases } = await import("./mock-merchants");
      return mockChangeAliases(merchantId, aliases, "add");
    }
    const res = await request<{ data: { aliases: string[] } }>(
      `/v1/merchants/${merchantId}/aliases`,
      { method: "POST", token, body: JSON.stringify({ aliases }) },
    );
    return res.data.aliases;
  },

  removeAliases: async (
    token: string,
    merchantId: string,
    aliases: string[],
  ): Promise<string[]> => {
    if (isMockSession()) {
      const { mockChangeAliases } = await import("./mock-merchants");
      return mockChangeAliases(merchantId, aliases, "remove");
    }
    const res = await request<{ data: { aliases: string[] } }>(
      `/v1/merchants/${merchantId}/aliases`,
      { method: "DELETE", token, body: JSON.stringify({ aliases }) },
    );
    return res.data.aliases;
  },
};

// ── Branches (admin) ─────────────────────────────────────────────────────────

export const branchesApi = {
  list: async (token: string, merchantId: string): Promise<Branch[]> => {
    if (isMockSession()) {
      const { mockListBranches } = await import("./mock-merchants");
      return mockListBranches(merchantId);
    }
    const res = await request<{ data: { branches: Branch[] } }>(
      `/v1/merchants/${merchantId}/branches`,
      { token },
    );
    return res.data.branches;
  },

  create: async (
    token: string,
    merchantId: string,
    body: CreateBranchInput,
  ): Promise<Branch> => {
    if (isMockSession()) {
      const { mockCreateBranch } = await import("./mock-merchants");
      return mockCreateBranch(merchantId, body);
    }
    const res = await request<{ data: Branch }>(
      `/v1/merchants/${merchantId}/branches`,
      { method: "POST", token, body: JSON.stringify(body) },
    );
    return res.data;
  },

  update: async (
    token: string,
    merchantId: string,
    branchId: string,
    body: UpdateBranchInput,
  ): Promise<Branch> => {
    if (isMockSession()) {
      const { mockUpdateBranch } = await import("./mock-merchants");
      return mockUpdateBranch(merchantId, branchId, body);
    }
    const res = await request<{ data: Branch }>(
      `/v1/merchants/${merchantId}/branches/${branchId}`,
      { method: "PATCH", token, body: JSON.stringify(body) },
    );
    return res.data;
  },

  delete: async (
    token: string,
    merchantId: string,
    branchId: string,
  ): Promise<void> => {
    if (isMockSession()) {
      const { mockDeleteBranch } = await import("./mock-merchants");
      mockDeleteBranch(merchantId, branchId);
      return;
    }
    await request<void>(`/v1/merchants/${merchantId}/branches/${branchId}`, {
      method: "DELETE",
      token,
    });
  },
};

// ── Orgs ─────────────────────────────────────────────────────────────────────

export const orgsApi = {
  create: async (
    token: string,
    body: { name: string; slug: string },
  ): Promise<Org> => {
    const res = await request<{ data: { org: Org } }>("/v1/orgs", {
      method: "POST",
      token,
      body: JSON.stringify(body),
    });
    return res.data.org;
  },

  get: async (
    token: string,
    orgId: string,
  ): Promise<{ org: Org; members: OrgMember[] }> => {
    const res = await request<{
      data: { org: Org; members?: OrgMember[] };
    }>(`/v1/orgs/${orgId}`, { token });
    return { org: res.data.org, members: res.data.members ?? [] };
  },

  update: async (
    token: string,
    orgId: string,
    body: {
      name?: string;
      slug?: string;
      website_url?: string;
      company_size?: string;
    },
  ): Promise<Org> => {
    const res = await request<{ data: { org: Org } }>(`/v1/orgs/${orgId}`, {
      method: "PATCH",
      token,
      body: JSON.stringify(body),
    });
    return res.data.org;
  },

  addMember: async (
    token: string,
    orgId: string,
    body: { email: string },
  ): Promise<OrgMember | null> => {
    const res = await request<{ data?: { member?: OrgMember } }>(
      `/v1/orgs/${orgId}/members`,
      { method: "POST", token, body: JSON.stringify(body) },
    );
    return res.data?.member ?? null;
  },

  removeMember: (token: string, orgId: string, userId: string) =>
    request<void>(`/v1/orgs/${orgId}/members/${userId}`, {
      method: "DELETE",
      token,
    }),
};

// ── Usage ────────────────────────────────────────────────────────────────────

export const usageApi = {
  list: (
    token: string,
    params?: {
      page?: number;
      limit?: number;
      from?: string;
      to?: string;
      key_id?: string;
    },
  ) => {
    const qs = new URLSearchParams(
      Object.entries(params ?? {})
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)]),
    ).toString();
    return request<{ logs: UsageRecord[]; total: number }>(
      `/v1/usage${qs ? `?${qs}` : ""}`,
      { token },
    );
  },

  summary: (token: string) =>
    request<UsageSummary>("/v1/usage/summary", { token }),
};
