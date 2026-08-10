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
