"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Store, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  merchantsApi,
  type Merchant,
  type MerchantListParams,
  type MerchantStatus,
} from "@/lib/api";
import { authStore } from "@/lib/auth-store";
import { ProjectLogo } from "@/components/project-logo";
import { countries } from "@/lib/countries";
import {
  merchantLogoUrl,
  STATUS_LABELS,
  STATUS_STYLES,
  TAG_OPTIONS,
} from "@/lib/merchant-meta";

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 350;

const ALL = "all";

type Filters = {
  status: string;
  mcc: string;
  industry_group: string;
  country: string;
  source: string;
  tags: string;
};

const EMPTY_FILTERS: Filters = {
  status: ALL,
  mcc: "",
  industry_group: "",
  country: ALL,
  source: ALL,
  tags: ALL,
};

const SOURCE_OPTIONS = ["manual", "import", "enrichment"];

export default function MerchantsPage() {
  const router = useRouter();
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Debounce the search box so typing doesn't fire a request per keystroke.
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchMerchants = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = await authStore.token();
      const params: MerchantListParams = {
        page,
        limit: PAGE_SIZE,
        ...(search ? { search } : {}),
        ...(filters.status !== ALL
          ? { status: filters.status as MerchantStatus }
          : {}),
        ...(filters.mcc.trim() ? { mcc: filters.mcc.trim() } : {}),
        ...(filters.industry_group.trim()
          ? { industry_group: filters.industry_group.trim() }
          : {}),
        ...(filters.country !== ALL ? { country: filters.country } : {}),
        ...(filters.source !== ALL ? { source: filters.source } : {}),
        ...(filters.tags !== ALL ? { tags: filters.tags } : {}),
      };
      const res = await merchantsApi.list(token, params);
      setMerchants(res.merchants);
      setTotal(res.total);
    } catch (err: unknown) {
      setMerchants([]);
      setTotal(0);
      setError(err instanceof Error ? err.message : "Failed to load merchants");
    } finally {
      setLoading(false);
    }
  }, [page, search, filters]);

  useEffect(() => {
    fetchMerchants();
  }, [fetchMerchants]);

  const setFilter = (key: keyof Filters, value: string) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(1);
  };

  const activeFilterCount = (Object.keys(filters) as (keyof Filters)[]).filter(
    (k) => filters[k] !== EMPTY_FILTERS[k],
  ).length;

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const isFiltered = !!search || activeFilterCount > 0;
  // An empty first page with no filters means the catalog itself is empty.
  const isEmptyCatalog =
    !loading && !error && total === 0 && !isFiltered && page === 1;

  if (isEmptyCatalog) {
    return (
      <div className="flex flex-col flex-1">
        <Header onAdd={() => router.push("/admin/merchants/new")} />
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-8">
          <div className="w-12 h-12 rounded-lg border border-neutral-200 flex items-center justify-center">
            <Store className="w-6 h-6 text-neutral-400" />
          </div>
          <h2 className="text-lg font-semibold text-neutral-900">
            No merchants yet
          </h2>
          <p className="text-sm text-neutral-500 max-w-sm">
            Add your first merchant to start managing them from the admin
            portal.
          </p>
          <Button
            className="bg-neutral-900 hover:bg-neutral-800 text-white gap-1.5 mt-1"
            iconLeading={<Plus className="w-4 h-4" />}
            onClick={() => router.push("/admin/merchants/new")}
          >
            Add Merchant
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <Header onAdd={() => router.push("/admin/merchants/new")} />

      <div className="p-8 flex flex-col gap-4">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-500">
              {total} merchant{total === 1 ? "" : "s"}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters((s) => !s)}
            >
              Filters
              {activeFilterCount > 0 && ` (${activeFilterCount})`}
            </Button>
            {isFiltered && (
              <Button
                variant="ghost"
                size="sm"
                className="text-neutral-500"
                iconLeading={<X className="w-3.5 h-3.5" />}
                onClick={() => {
                  setFilters(EMPTY_FILTERS);
                  setSearchInput("");
                  setPage(1);
                }}
              >
                Clear
              </Button>
            )}
          </div>
          <div className="relative w-125">
            <Search className="absolute left-3 top-[50%] -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              placeholder="Search by name, alias, MCC..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-8 h-10 text-sm"
            />
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-3 gap-4 border border-neutral-200 rounded-lg p-4 bg-neutral-50">
            <FilterField label="Status">
              <Select
                value={filters.status}
                onValueChange={(v) => setFilter("status", v)}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All statuses</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </FilterField>

            <FilterField label="MCC">
              <Input
                placeholder="e.g. 5814"
                value={filters.mcc}
                maxLength={4}
                onChange={(e) => setFilter("mcc", e.target.value)}
                className="bg-white"
              />
            </FilterField>

            <FilterField label="Industry group">
              <Input
                placeholder="e.g. Food & Beverage"
                value={filters.industry_group}
                onChange={(e) => setFilter("industry_group", e.target.value)}
                className="bg-white"
              />
            </FilterField>

            <FilterField label="Country">
              <Select
                value={filters.country}
                onValueChange={(v) => setFilter("country", v)}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All countries</SelectItem>
                  {countries.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterField>

            <FilterField label="Source">
              <Select
                value={filters.source}
                onValueChange={(v) => setFilter("source", v)}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All sources</SelectItem>
                  {SOURCE_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterField>

            <FilterField label="Tag">
              <Select
                value={filters.tags}
                onValueChange={(v) => setFilter("tags", v)}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All tags</SelectItem>
                  {TAG_OPTIONS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterField>
          </div>
        )}

        <div className="border border-neutral-200 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-50 hover:bg-neutral-50">
                <TableHead className="px-4 text-xs text-neutral-600 font-medium">
                  Merchant
                </TableHead>
                <TableHead className="text-xs text-neutral-600 font-medium">
                  MCC
                </TableHead>
                <TableHead className="text-xs text-neutral-600 font-medium">
                  Aliases
                </TableHead>
                <TableHead className="text-xs text-neutral-600 font-medium">
                  Status
                </TableHead>
                <TableHead className="text-xs text-neutral-600 font-medium">
                  Added on
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {merchants.map((merchant, i) => {
                const aliases = merchant.aliases ?? [];
                return (
                  <TableRow
                    key={merchant.id}
                    onClick={() =>
                      router.push(`/admin/merchants/${merchant.id}`)
                    }
                    className={cn(
                      i % 2 === 0 ? "bg-neutral-50" : "bg-white",
                      "hover:bg-neutral-100 cursor-pointer",
                    )}
                  >
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <ProjectLogo
                          name={merchant.name}
                          logo={merchantLogoUrl(merchant.merchant_logo)}
                          size="sm"
                        />
                        <span className="text-sm font-medium text-neutral-900">
                          {merchant.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-sm text-neutral-600">
                      {merchant.mcc}
                    </TableCell>
                    <TableCell className="py-4 text-sm text-neutral-600">
                      {aliases.length === 0
                        ? "—"
                        : aliases.slice(0, 2).join(", ")}
                      {aliases.length > 2 && (
                        <span className="text-xs text-neutral-400">
                          {" "}
                          +{aliases.length - 2} more
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="py-4">
                      <span
                        className={cn(
                          "text-xs font-medium px-2 py-0.5 rounded",
                          STATUS_STYLES[merchant.status] ??
                            "text-neutral-600 bg-neutral-100",
                        )}
                      >
                        {STATUS_LABELS[merchant.status] ?? merchant.status}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 text-sm text-neutral-600">
                      {new Date(merchant.created_at).toLocaleDateString(
                        "en-US",
                        { month: "long", day: "2-digit", year: "numeric" },
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {merchants.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-10 text-center text-sm text-neutral-400"
                  >
                    {loading
                      ? "Loading…"
                      : error
                        ? error
                        : search
                          ? `No merchants match “${search}”`
                          : "No merchants match these filters"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200 bg-white">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1 || loading}
                className={cn(page <= 1 && "text-neutral-400")}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages || loading}
                className={cn(page >= totalPages && "text-neutral-400")}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
            <span className="text-xs text-neutral-600 font-semibold">
              Page {page} of {totalPages}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Header({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="px-8 py-6 border-b border-neutral-200 flex items-center justify-between bg-white z-50">
      <h1 className="text-xl font-semibold text-neutral-900">Merchants</h1>
      <Button
        className="bg-neutral-900 hover:bg-neutral-800 text-white gap-1.5"
        iconLeading={<Plus className="w-4 h-4" />}
        onClick={onAdd}
      >
        Add Merchant
      </Button>
    </div>
  );
}

function FilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-neutral-600">{label}</label>
      {children}
    </div>
  );
}
