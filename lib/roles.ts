/**
 * Roles allowed into the admin area.
 *
 * Reads and writes share one gate: per the backend contract both `admin` and
 * `owner` may write to the merchant catalog, so there is no read-only tier to
 * distinguish. Keep this the single source of truth — the dashboard sidebar
 * link and the admin layout guard both read it.
 */
export const ADMIN_ROLES = ["admin", "owner"] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

export const isAdminRole = (role: string | undefined | null): boolean =>
  !!role && (ADMIN_ROLES as readonly string[]).includes(role);
