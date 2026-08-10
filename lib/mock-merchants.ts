import type {
  Branch,
  CreateBranchInput,
  CreateMerchantInput,
  Merchant,
  MerchantDetail,
  MerchantListParams,
  UpdateBranchInput,
  UpdateMerchantInput,
} from "./api";

// In-memory merchant store used when NEXT_PUBLIC_MOCK_SESSION=true, so the
// admin UI is fully usable without a backend. Resets on page reload.
const mockMerchants: Merchant[] = [
  { id: "mrc_1", name: "McDonald's", merchant_logo: null, mcc: "5814", status: "verified", aliases: ["mcdonalds", "mcds", "golden arches"], created_at: "2026-01-12T09:30:00Z" },
  { id: "mrc_2", name: "Starbucks Coffee", merchant_logo: null, mcc: "5814", status: "verified", aliases: ["starbucks", "sbux", "starbucks cafe"], created_at: "2026-01-28T14:05:00Z" },
  { id: "mrc_3", name: "Melcom Ghana", merchant_logo: null, mcc: "5311", status: "verified", aliases: ["melcom", "melcom stores"], created_at: "2026-02-03T11:20:00Z" },
  { id: "mrc_4", name: "Shell", merchant_logo: null, mcc: "5541", status: "archived", aliases: ["shell fuel", "shell station"], created_at: "2026-02-19T08:45:00Z" },
  { id: "mrc_5", name: "Palace Supermarket", merchant_logo: null, mcc: "5411", status: "pending", aliases: ["palace", "palace mart"], created_at: "2026-03-02T16:10:00Z" },
  { id: "mrc_6", name: "Uber", merchant_logo: null, mcc: "4121", status: "verified", aliases: ["uber trip", "uber bv", "uber rides"], created_at: "2026-03-15T10:00:00Z" },
  { id: "mrc_7", name: "Kempinski Gold Coast", merchant_logo: null, mcc: "7011", status: "archived", aliases: ["kempinski", "kempinski accra"], created_at: "2026-03-27T13:35:00Z" },
  { id: "mrc_8", name: "Vodafone Cash", merchant_logo: null, mcc: "4814", status: "verified", aliases: ["vodafone", "vf cash", "telecel cash"], created_at: "2026-04-08T09:15:00Z" },
  { id: "mrc_9", name: "Jumia", merchant_logo: null, mcc: "5399", status: "pending", aliases: ["jumia gh", "jumia pay"], created_at: "2026-04-21T15:50:00Z" },
  { id: "mrc_10", name: "KFC", merchant_logo: null, mcc: "5814", status: "verified", aliases: ["kfc accra", "kentucky fried chicken"], created_at: "2026-05-05T12:25:00Z" },
  { id: "mrc_11", name: "Zenith Pharmacy", merchant_logo: null, mcc: "5912", status: "verified", aliases: ["zenith pharm"], created_at: "2026-05-18T08:00:00Z" },
  { id: "mrc_12", name: "Accra City Hotel", merchant_logo: null, mcc: "7011", status: "archived", aliases: ["accra city", "ach hotel"], created_at: "2026-06-01T17:40:00Z" },
  { id: "mrc_13", name: "Netflix", merchant_logo: null, mcc: "4899", status: "verified", aliases: ["netflix.com", "netflix intl"], created_at: "2026-06-14T07:55:00Z" },
  { id: "mrc_14", name: "Spotify", merchant_logo: null, mcc: "5815", status: "pending", aliases: ["spotify ab", "spotify premium"], created_at: "2026-07-02T11:05:00Z" },
];

// Detail-only fields, kept apart so the list mock still returns the list shape.
const mockDetails: Record<string, Partial<MerchantDetail>> = {
  mrc_2: {
    description: "Multinational chain of coffeehouses and roastery reserves.",
    industry_group: "Food & Beverage",
    mcc_description: "Eating Places, Restaurants",
    tags: ["ecommerce", "in_store"],
    website: "https://www.starbucks.com",
    email: "contact@starbucks.com",
    phone: "+1-800-782-7282",
    headquarters: "Seattle, WA",
    country: "US",
    founded_year: 1971,
    brand_colors: ["#00704a", "#1e3932"],
    recognition_confidence: 95,
    source: "manual",
    internal_notes: "Verified via official website and business registration.",
  },
};

export function mockListMerchants(params?: MerchantListParams): {
  merchants: Merchant[];
  total: number;
} {
  const search = params?.search?.trim().toLowerCase();
  let filtered = search
    ? mockMerchants.filter((m) =>
        [m.name, m.mcc, ...m.aliases].some((v) =>
          v.toLowerCase().includes(search),
        ),
      )
    : mockMerchants;

  if (params?.status)
    filtered = filtered.filter((m) => m.status === params.status);
  if (params?.mcc) filtered = filtered.filter((m) => m.mcc === params.mcc);
  if (params?.industry_group)
    filtered = filtered.filter(
      (m) => mockDetails[m.id]?.industry_group === params.industry_group,
    );
  if (params?.country)
    filtered = filtered.filter(
      (m) => mockDetails[m.id]?.country === params.country,
    );
  if (params?.source)
    filtered = filtered.filter(
      (m) => mockDetails[m.id]?.source === params.source,
    );
  if (params?.tags) {
    const wanted = params.tags.split(",").map((t) => t.trim());
    filtered = filtered.filter((m) =>
      wanted.every((t) => mockDetails[m.id]?.tags?.includes(t)),
    );
  }

  const limit = params?.limit ?? filtered.length;
  const page = params?.page ?? 1;
  return {
    merchants: filtered.slice((page - 1) * limit, page * limit),
    total: filtered.length,
  };
}

export function mockGetMerchant(merchantId: string): MerchantDetail {
  const merchant = mockMerchants.find((m) => m.id === merchantId);
  if (!merchant) throw new Error("Merchant not found");
  return { ...merchant, ...mockDetails[merchantId] };
}

export function mockDeleteMerchant(merchantId: string): void {
  const i = mockMerchants.findIndex((m) => m.id === merchantId);
  if (i === -1) throw new Error("Merchant not found");
  mockMerchants.splice(i, 1);
  delete mockBranches[merchantId];
}

export function mockChangeAliases(
  merchantId: string,
  aliases: string[],
  mode: "add" | "remove",
): string[] {
  const merchant = mockMerchants.find((m) => m.id === merchantId);
  if (!merchant) throw new Error("Merchant not found");
  merchant.aliases =
    mode === "add"
      ? [...new Set([...merchant.aliases, ...aliases])]
      : merchant.aliases.filter((a) => !aliases.includes(a));
  return merchant.aliases;
}

export function mockCreateMerchant(body: CreateMerchantInput): Merchant {
  const now = new Date().toISOString();
  const merchant: Merchant = {
    id: `mrc_${mockMerchants.length + 1}_${Date.now()}`,
    name: body.name,
    merchant_logo: body.merchant_logo ?? null,
    mcc: body.mcc,
    status: body.status ?? "pending",
    aliases: body.aliases ?? [],
    created_at: now,
    updated_at: now,
  };
  mockMerchants.unshift(merchant);
  return merchant;
}

export function mockUpdateMerchant(
  merchantId: string,
  body: UpdateMerchantInput,
): Merchant {
  const merchant = mockMerchants.find((m) => m.id === merchantId);
  if (!merchant) throw new Error("Merchant not found");
  if (body.name !== undefined) merchant.name = body.name;
  if (body.mcc !== undefined) merchant.mcc = body.mcc;
  if (body.status !== undefined) merchant.status = body.status;
  if (body.aliases !== undefined) merchant.aliases = body.aliases;
  if (body.merchant_logo !== undefined)
    merchant.merchant_logo = body.merchant_logo;
  merchant.updated_at = new Date().toISOString();

  // Everything else lives in the detail map so the edit → detail round trip
  // reflects the change.
  const rest: Partial<MerchantDetail> = { ...body };
  delete rest.name;
  delete rest.mcc;
  delete rest.status;
  delete rest.aliases;
  delete rest.merchant_logo;
  mockDetails[merchantId] = { ...mockDetails[merchantId], ...rest };

  return merchant;
}

// ── Branches ─────────────────────────────────────────────────────────────────

const mockBranches: Record<string, Branch[]> = {
  mrc_2: [
    { id: "brn_1", merchant_id: "mrc_2", name: "Starbucks - Accra Mall", address: "Spintex Road, Accra Mall, Unit 12", city: "Accra", country: "GH", status: "active", created_at: "2026-02-01T10:00:00Z" },
    { id: "brn_2", merchant_id: "mrc_2", name: "Starbucks - Airport City", address: "Liberation Road", city: "Accra", country: "GH", status: "inactive", created_at: "2026-03-11T10:00:00Z" },
  ],
};

let mockBranchSeq = 3;

export function mockListBranches(merchantId: string): Branch[] {
  return mockBranches[merchantId] ?? [];
}

export function mockCreateBranch(
  merchantId: string,
  body: CreateBranchInput,
): Branch {
  const branch: Branch = {
    id: `brn_${mockBranchSeq++}`,
    merchant_id: merchantId,
    name: body.name,
    address: body.address ?? null,
    city: body.city ?? null,
    country: body.country ?? null,
    status: body.status ?? "active",
    created_at: new Date().toISOString(),
  };
  mockBranches[merchantId] = [...(mockBranches[merchantId] ?? []), branch];
  return branch;
}

export function mockUpdateBranch(
  merchantId: string,
  branchId: string,
  body: UpdateBranchInput,
): Branch {
  const branch = mockBranches[merchantId]?.find((b) => b.id === branchId);
  if (!branch) throw new Error("Branch not found");
  Object.assign(branch, body, { updated_at: new Date().toISOString() });
  return branch;
}

export function mockDeleteBranch(merchantId: string, branchId: string): void {
  mockBranches[merchantId] = (mockBranches[merchantId] ?? []).filter(
    (b) => b.id !== branchId,
  );
}

/**
 * Stands in for the presigned-upload round trip: returns a data URL so mock
 * mode has something renderable to PATCH onto the merchant.
 */
export function mockUploadImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error(`Upload failed for ${file.name}`));
    reader.readAsDataURL(file);
  });
}
