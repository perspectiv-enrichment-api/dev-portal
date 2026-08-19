"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectLogo } from "@/components/project-logo";
import { cn } from "@/lib/utils";
import {
  branchesApi,
  merchantsApi,
  type Branch,
  type BranchStatus,
  type CreateBranchInput,
  type MerchantDetail,
} from "@/lib/api";
import { authStore } from "@/lib/auth-store";
import { countries } from "@/lib/countries";
import {
  merchantLogoUrl,
  STATUS_LABELS,
  STATUS_STYLES,
} from "@/lib/merchant-meta";

const countryName = (code?: string | null) =>
  countries.find((c) => c.code === code)?.name ?? code ?? "—";

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 py-3 border-b border-neutral-100 last:border-b-0">
      <span className="w-48 shrink-0 text-sm text-neutral-500">{label}</span>
      <span className="flex-1 text-sm text-neutral-900 break-words">
        {children}
      </span>
    </div>
  );
}

function BranchDialog({
  open,
  onOpenChange,
  branch,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branch: Branch | null;
  onSave: (body: CreateBranchInput) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [status, setStatus] = useState<BranchStatus>("active");
  const [saving, setSaving] = useState(false);

  // Reset the fields each time the dialog opens so it never shows stale values
  // from a previously edited branch.
  useEffect(() => {
    if (!open) return;
    setName(branch?.name ?? "");
    setAddress(branch?.address ?? "");
    setCity(branch?.city ?? "");
    setCountry(branch?.country ?? "");
    setStatus(branch?.status ?? "active");
  }, [open, branch]);

  const handleSave = async () => {
    if (!name.trim() || saving) return;
    setSaving(true);
    try {
      await onSave({
        name: name.trim(),
        ...(address.trim() ? { address: address.trim() } : {}),
        ...(city.trim() ? { city: city.trim() } : {}),
        ...(country ? { country } : {}),
        status,
      });
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{branch ? "Edit branch" : "Add branch"}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Branch name</label>
            <Input
              placeholder="e.g. Starbucks - Accra Mall"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Address</label>
            <Input
              placeholder="e.g. Spintex Road, Accra Mall, Unit 12"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">City</label>
              <Input
                placeholder="e.g. Accra"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Country</label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as BranchStatus)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-neutral-900 hover:bg-neutral-800 text-white"
            onClick={handleSave}
            disabled={saving || !name.trim()}
          >
            {saving ? "Saving…" : branch ? "Save changes" : "Add branch"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function MerchantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [merchant, setMerchant] = useState<MerchantDetail | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [error, setError] = useState("");

  const [newAliases, setNewAliases] = useState("");
  const [aliasSaving, setAliasSaving] = useState(false);

  const [branchDialogOpen, setBranchDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [deletingBranch, setDeletingBranch] = useState<Branch | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const load = useCallback(async () => {
    try {
      const token = await authStore.token();
      const [detail, branchList] = await Promise.all([
        merchantsApi.get(token, id),
        branchesApi.list(token, id).catch(() => [] as Branch[]),
      ]);
      setMerchant(detail);
      setBranches(branchList);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load merchant");
    }
  }, [id]);

  useEffect(() => {
    if (id) load();
  }, [id, load]);

  const handleAddAliases = async () => {
    const list = newAliases
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);
    if (!list.length || aliasSaving) return;
    setAliasSaving(true);
    try {
      const token = await authStore.token();
      const updated = await merchantsApi.addAliases(token, id, list);
      setMerchant((m) => (m ? { ...m, aliases: updated } : m));
      setNewAliases("");
      toast.success(list.length === 1 ? "Alias added" : "Aliases added");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to add aliases");
    } finally {
      setAliasSaving(false);
    }
  };

  const handleRemoveAlias = async (alias: string) => {
    try {
      const token = await authStore.token();
      const updated = await merchantsApi.removeAliases(token, id, [alias]);
      setMerchant((m) => (m ? { ...m, aliases: updated } : m));
      toast.success("Alias removed");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to remove alias");
    }
  };

  const handleSaveBranch = async (body: CreateBranchInput) => {
    try {
      const token = await authStore.token();
      if (editingBranch) {
        const updated = await branchesApi.update(
          token,
          id,
          editingBranch.id,
          body,
        );
        setBranches((bs) =>
          bs.map((b) => (b.id === updated.id ? updated : b)),
        );
        toast.success("Branch updated");
      } else {
        const created = await branchesApi.create(token, id, body);
        setBranches((bs) => [...bs, created]);
        toast.success("Branch added");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save branch");
      throw err;
    }
  };

  const handleDeleteBranch = async () => {
    if (!deletingBranch) return;
    try {
      const token = await authStore.token();
      await branchesApi.delete(token, id, deletingBranch.id);
      setBranches((bs) => bs.filter((b) => b.id !== deletingBranch.id));
      toast.success("Branch deleted");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete branch",
      );
    } finally {
      setDeletingBranch(null);
    }
  };

  const handleDeleteMerchant = async () => {
    try {
      const token = await authStore.token();
      await merchantsApi.delete(token, id);
      toast.success("Merchant deleted");
      router.push("/admin/merchants");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete merchant",
      );
    }
  };

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (!merchant) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-neutral-400">
        Loading…
      </div>
    );
  }

  const aliases = merchant.aliases ?? [];

  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <div className="px-8 py-6 border-b border-neutral-200 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/admin/merchants"
            className="text-neutral-400 hover:text-neutral-600 transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <ProjectLogo
            name={merchant.name}
            logo={merchantLogoUrl(merchant.merchant_logo)}
            size="sm"
          />
          <h1 className="text-xl font-semibold text-neutral-900 truncate">
            {merchant.name}
          </h1>
          <span
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded shrink-0",
              STATUS_STYLES[merchant.status] ??
                "text-neutral-600 bg-neutral-100",
            )}
          >
            {STATUS_LABELS[merchant.status] ?? merchant.status}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            iconLeading={<Pencil className="w-4 h-4" />}
            onClick={() => router.push(`/admin/merchants/${id}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            iconLeading={<Trash2 className="w-4 h-4" />}
            onClick={() => setConfirmDelete(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="p-8">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="aliases">Aliases ({aliases.length})</TabsTrigger>
            <TabsTrigger value="branches">
              Branches ({branches.length})
            </TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="mt-6">
            <div className="border border-neutral-200 rounded-lg px-5 py-2 max-w-3xl">
              <Row label="Description">{merchant.description || "—"}</Row>
              <Row label="Industry group">{merchant.industry_group || "—"}</Row>
              <Row label="MCC">
                {merchant.mcc}
                {merchant.mcc_description
                  ? ` — ${merchant.mcc_description}`
                  : ""}
              </Row>
              <Row label="Tags">
                {merchant.tags?.length ? merchant.tags.join(", ") : "—"}
              </Row>
              <Row label="Website">
                {merchant.website ? (
                  <a
                    href={merchant.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {merchant.website}
                  </a>
                ) : (
                  "—"
                )}
              </Row>
              <Row label="Email">{merchant.email || "—"}</Row>
              <Row label="Phone">{merchant.phone || "—"}</Row>
              <Row label="Headquarters">{merchant.headquarters || "—"}</Row>
              <Row label="Country">{countryName(merchant.country)}</Row>
              <Row label="Founded">{merchant.founded_year || "—"}</Row>
              <Row label="Brand colors">
                {merchant.brand_colors?.length ? (
                  <span className="flex items-center gap-1.5">
                    {merchant.brand_colors.map((c) => (
                      <span
                        key={c}
                        className="w-5 h-5 rounded-full border border-neutral-200"
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </span>
                ) : (
                  "—"
                )}
              </Row>
              <Row label="Alternate logos">
                {merchant.alternate_logos?.length ? (
                  <span className="flex items-center gap-2">
                    {merchant.alternate_logos.map((url) => (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        key={url}
                        src={merchantLogoUrl(url)}
                        alt="Alternate logo"
                        className="w-8 h-8 rounded border border-neutral-200 object-contain"
                      />
                    ))}
                  </span>
                ) : (
                  "—"
                )}
              </Row>
              <Row label="Category icon">
                {merchant.category_icon ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={merchantLogoUrl(merchant.category_icon)}
                    alt="Category icon"
                    className="w-8 h-8 rounded border border-neutral-200 object-contain"
                  />
                ) : (
                  "—"
                )}
              </Row>
              <Row label="Recognition confidence">
                {merchant.recognition_confidence != null
                  ? `${merchant.recognition_confidence}%`
                  : "—"}
              </Row>
              <Row label="Source">{merchant.source || "—"}</Row>
              <Row label="Internal notes">{merchant.internal_notes || "—"}</Row>
              <Row label="Added on">
                {new Date(merchant.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "2-digit",
                  year: "numeric",
                })}
              </Row>
            </div>
          </TabsContent>

          {/* Aliases */}
          <TabsContent value="aliases" className="mt-6">
            <div className="flex flex-col gap-4 max-w-3xl">
              <p className="text-sm text-neutral-500">
                Alternate names used to match this merchant in transaction
                descriptions.
              </p>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Comma-separated, e.g. SBUX STORE 4521, STARBUCKS RESERVE"
                  value={newAliases}
                  onChange={(e) => setNewAliases(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddAliases();
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  className="bg-neutral-900 hover:bg-neutral-800 text-white shrink-0"
                  iconLeading={<Plus className="w-4 h-4" />}
                  onClick={handleAddAliases}
                  disabled={aliasSaving || !newAliases.trim()}
                >
                  {aliasSaving ? "Adding…" : "Add"}
                </Button>
              </div>
              {aliases.length === 0 ? (
                <p className="text-sm text-neutral-400 border border-dashed border-neutral-200 rounded-lg py-8 text-center">
                  No aliases yet.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {aliases.map((alias) => (
                    <span
                      key={alias}
                      className="flex items-center gap-1.5 text-sm text-neutral-700 bg-neutral-100 rounded-md pl-2.5 pr-1.5 py-1"
                    >
                      {alias}
                      <button
                        type="button"
                        onClick={() => handleRemoveAlias(alias)}
                        className="text-neutral-400 hover:text-neutral-700"
                        aria-label={`Remove ${alias}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Branches */}
          <TabsContent value="branches" className="mt-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-neutral-500">
                  Physical locations belonging to this merchant.
                </p>
                <Button
                  className="bg-neutral-900 hover:bg-neutral-800 text-white gap-1.5"
                  iconLeading={<Plus className="w-4 h-4" />}
                  onClick={() => {
                    setEditingBranch(null);
                    setBranchDialogOpen(true);
                  }}
                >
                  Add Branch
                </Button>
              </div>

              {branches.length === 0 ? (
                <p className="text-sm text-neutral-400 border border-dashed border-neutral-200 rounded-lg py-10 text-center">
                  No branches yet.
                </p>
              ) : (
                <div className="border border-neutral-200 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-neutral-50 hover:bg-neutral-50">
                        <TableHead className="px-4 text-xs text-neutral-600 font-medium">
                          Branch
                        </TableHead>
                        <TableHead className="text-xs text-neutral-600 font-medium">
                          Address
                        </TableHead>
                        <TableHead className="text-xs text-neutral-600 font-medium">
                          City
                        </TableHead>
                        <TableHead className="text-xs text-neutral-600 font-medium">
                          Country
                        </TableHead>
                        <TableHead className="text-xs text-neutral-600 font-medium">
                          Status
                        </TableHead>
                        <TableHead className="text-xs text-neutral-600 font-medium text-right pr-4">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {branches.map((branch, i) => (
                        <TableRow
                          key={branch.id}
                          className={cn(
                            i % 2 === 0 ? "bg-neutral-50" : "bg-white",
                            "hover:bg-neutral-100",
                          )}
                        >
                          <TableCell className="px-4 py-4 text-sm font-medium text-neutral-900">
                            {branch.name}
                          </TableCell>
                          <TableCell className="py-4 text-sm text-neutral-600">
                            {branch.address || "—"}
                          </TableCell>
                          <TableCell className="py-4 text-sm text-neutral-600">
                            {branch.city || "—"}
                          </TableCell>
                          <TableCell className="py-4 text-sm text-neutral-600">
                            {countryName(branch.country)}
                          </TableCell>
                          <TableCell className="py-4">
                            <span
                              className={cn(
                                "text-xs font-medium px-2 py-0.5 rounded",
                                branch.status === "active"
                                  ? "text-emerald-600 bg-emerald-50"
                                  : "text-neutral-600 bg-neutral-100",
                              )}
                            >
                              {branch.status === "active"
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </TableCell>
                          <TableCell className="py-4 pr-4">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingBranch(branch);
                                  setBranchDialogOpen(true);
                                }}
                                className="text-neutral-400 hover:text-neutral-700 p-1.5"
                                aria-label={`Edit ${branch.name}`}
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingBranch(branch)}
                                className="text-neutral-400 hover:text-destructive p-1.5"
                                aria-label={`Delete ${branch.name}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BranchDialog
        open={branchDialogOpen}
        onOpenChange={setBranchDialogOpen}
        branch={editingBranch}
        onSave={handleSaveBranch}
      />

      {/* Delete branch */}
      <AlertDialog
        open={!!deletingBranch}
        onOpenChange={(open) => !open && setDeletingBranch(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete branch?</AlertDialogTitle>
            <AlertDialogDescription>
              {deletingBranch?.name} will be permanently removed. This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBranch}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete branch
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete merchant */}
      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {merchant.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the merchant from the global enrichment catalog,
              along with its aliases and branches. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMerchant}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete merchant
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
