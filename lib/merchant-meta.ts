import type { MerchantStatus } from "./api";

export const STATUS_STYLES: Record<MerchantStatus, string> = {
  verified: "text-emerald-600 bg-emerald-50",
  pending: "text-amber-600 bg-amber-50",
  archived: "text-neutral-600 bg-neutral-100",
};

export const STATUS_LABELS: Record<MerchantStatus, string> = {
  verified: "Verified",
  pending: "Pending",
  archived: "Archived",
};

export const TAG_OPTIONS = [
  { value: "ecommerce", label: "E-commerce" },
  { value: "subscription", label: "Subscription" },
  { value: "marketplace", label: "Marketplace" },
  { value: "crypto", label: "Crypto" },
  { value: "in_store", label: "In-store" },
  { value: "recurring_billing", label: "Recurring billing" },
  { value: "travel", label: "Travel" },
  { value: "gaming", label: "Gaming" },
];

const LOGO_CDN = (
  process.env.NEXT_PUBLIC_LOGO_CDN ??
  "https://cdn.jsdelivr.net/gh/perspectiv-enrichment-api/merchant-logo-cdn/merchant_logos/"
).replace(/\/+$/, "");

/**
 * Merchant images come in two shapes: seeded rows store a bare filename
 * (`adobe.png`) served from the shared logo CDN, while anything uploaded
 * through the storage flow stores an absolute URL. Resolve either into a src
 * an `<img>` can load.
 */
export function merchantLogoUrl(
  value: string | null | undefined,
): string | undefined {
  if (!value) return undefined;
  if (/^(https?:)?\/\//.test(value) || value.startsWith("data:")) return value;
  if (value.startsWith("/")) return value;
  return `${LOGO_CDN}/${value}`;
}
