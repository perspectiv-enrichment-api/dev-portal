"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { cn } from "@/lib/utils";
import {
  merchantsApi,
  MERCHANT_IMAGE_TYPES,
  type CreateMerchantInput,
  type MerchantDetail,
  type MerchantImageType,
  type MerchantLogoKind,
  type UpdateMerchantInput,
} from "@/lib/api";
import { authStore } from "@/lib/auth-store";
import { countries } from "@/lib/countries";
import { merchantLogoUrl, TAG_OPTIONS } from "@/lib/merchant-meta";

const MAX_IMAGE_BYTES = 1024 * 1024;
const IMAGE_ACCEPT = MERCHANT_IMAGE_TYPES.join(",");

/**
 * An image slot either holds what the server already has (a URL) or a file the
 * user just picked (uploaded on save). `dataUrl` is preview-only.
 */
type ImageValue =
  | { kind: "existing"; url: string }
  | { kind: "new"; file: File; dataUrl: string; fileName: string };

const previewSrc = (img: ImageValue) =>
  img.kind === "existing" ? merchantLogoUrl(img.url) : img.dataUrl;

const previewLabel = (img: ImageValue) =>
  img.kind === "existing"
    ? (img.url.split("/").pop() || "Current image")
    : img.fileName;

function Section({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-8 px-8 py-8 border-b-2 border-neutral-100 mx-8 last:border-b-0">
      <div className="w-56 shrink-0">
        <p className="text-sm font-semibold text-neutral-900">{label}</p>
        {description && (
          <p className="text-sm text-neutral-500 mt-0.5">{description}</p>
        )}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function Field({
  label,
  children,
  className,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  hint?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="text-sm font-medium text-neutral-900">{label}</label>
      {children}
      {hint && <span className="text-xs text-neutral-500">{hint}</span>}
    </div>
  );
}

function readImageFile(
  file: File,
  onLoaded: (img: ImageValue) => void,
  onError: (msg: string) => void,
) {
  if (!MERCHANT_IMAGE_TYPES.includes(file.type as MerchantImageType)) {
    onError("Image must be a PNG, JPEG or WebP");
    return;
  }
  if (file.size > MAX_IMAGE_BYTES) {
    onError("Image must be 1MB or smaller");
    return;
  }
  const reader = new FileReader();
  reader.onload = () =>
    onLoaded({
      kind: "new",
      file,
      dataUrl: reader.result as string,
      fileName: file.name,
    });
  reader.readAsDataURL(file);
}

function ImagePreview({
  img,
  onRemove,
}: {
  img: ImageValue;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-3 border border-neutral-200 rounded-md px-3 py-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={previewSrc(img)}
        alt="Preview"
        className="w-9 h-9 rounded-full border border-neutral-200 object-contain shrink-0"
      />
      <span className="text-sm text-neutral-600 truncate flex-1">
        {previewLabel(img)}
      </span>
      <button
        type="button"
        onClick={onRemove}
        className="text-neutral-400 hover:text-neutral-600 shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function ImageUpload({
  value,
  onChange,
  placeholder,
}: {
  value: ImageValue | null;
  onChange: (img: ImageValue | null) => void;
  placeholder: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_ACCEPT}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          readImageFile(file, onChange, (msg) => toast.error(msg));
        }}
      />
      {value ? (
        <ImagePreview img={value} onRemove={() => onChange(null)} />
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center justify-center gap-2 border border-dashed border-neutral-300 rounded-md px-3 py-3 text-sm text-neutral-500 hover:border-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer w-full"
        >
          <Upload className="w-4 h-4" />
          {placeholder}
        </button>
      )}
    </>
  );
}

function MultiImageUpload({
  values,
  onChange,
}: {
  values: ImageValue[];
  onChange: (imgs: ImageValue[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_ACCEPT}
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = "";
          files.forEach((file) =>
            readImageFile(
              file,
              (img) => onChange([...values, img]),
              (msg) => toast.error(`${file.name}: ${msg}`),
            ),
          );
        }}
      />
      {values.map((img, i) => (
        <ImagePreview
          key={`${previewLabel(img)}-${i}`}
          img={img}
          onRemove={() => onChange(values.filter((_, j) => j !== i))}
        />
      ))}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex items-center justify-center gap-2 border border-dashed border-neutral-300 rounded-md px-3 py-3 text-sm text-neutral-500 hover:border-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
      >
        <Upload className="w-4 h-4" />
        {values.length === 0 ? "Upload images" : "Add another image"}
      </button>
    </div>
  );
}

/**
 * Create/edit form for a merchant. Aliases are only editable at create time —
 * afterwards they have dedicated add/remove endpoints and live on the detail
 * page, so this form deliberately omits them in edit mode.
 */
export function MerchantForm({ initial }: { initial?: MerchantDetail }) {
  const router = useRouter();
  const isEdit = !!initial;
  const backHref = isEdit
    ? `/admin/merchants/${initial.id}`
    : "/admin/merchants";

  // Merchant information
  const [name, setName] = useState(initial?.name ?? "");
  const [logo, setLogo] = useState<ImageValue | null>(
    initial?.merchant_logo
      ? { kind: "existing", url: initial.merchant_logo }
      : null,
  );
  const [status, setStatus] = useState(initial?.status ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  // Business information
  const [website, setWebsite] = useState(initial?.website ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [headquarters, setHeadquarters] = useState(initial?.headquarters ?? "");
  const [country, setCountry] = useState(initial?.country ?? "");
  const [founded, setFounded] = useState(
    initial?.founded_year ? String(initial.founded_year) : "",
  );
  // Branding
  const [alternateLogos, setAlternateLogos] = useState<ImageValue[]>(
    (initial?.alternate_logos ?? []).map((url) => ({
      kind: "existing" as const,
      url,
    })),
  );
  const [categoryIcon, setCategoryIcon] = useState<ImageValue | null>(
    initial?.category_icon
      ? { kind: "existing", url: initial.category_icon }
      : null,
  );
  const [brandColors, setBrandColors] = useState(
    (initial?.brand_colors ?? []).join(", "),
  );
  // Classification
  const [industryGroup, setIndustryGroup] = useState(
    initial?.industry_group ?? "",
  );
  const [mcc, setMcc] = useState(initial?.mcc ?? "");
  const [mccDescription, setMccDescription] = useState(
    initial?.mcc_description ?? "",
  );
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  // Transaction recognition (create only)
  const [aliases, setAliases] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = !!name.trim() && /^\d{4}$/.test(mcc.trim());

  const splitList = (value: string) =>
    value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

  const brandColorList = splitList(brandColors);

  /** Uploads any newly-picked files and returns the image fields to persist. */
  async function resolveImages(
    token: string,
    merchantId: string,
  ): Promise<UpdateMerchantInput> {
    const upload = (file: File, kind: MerchantLogoKind) =>
      merchantsApi.uploadImage(token, merchantId, file, kind);

    const patch: UpdateMerchantInput = {};

    if (!logo && initial?.merchant_logo) patch.merchant_logo = null;
    if (logo?.kind === "new") {
      patch.merchant_logo = await upload(logo.file, "primary");
    }

    if (!categoryIcon && initial?.category_icon) patch.category_icon = null;
    if (categoryIcon?.kind === "new") {
      patch.category_icon = await upload(categoryIcon.file, "category_icon");
    }

    const existingAlternates = (initial?.alternate_logos ?? []).length;
    const hasNewAlternate = alternateLogos.some((l) => l.kind === "new");
    const droppedAlternate = alternateLogos.length !== existingAlternates;
    if (hasNewAlternate || droppedAlternate) {
      patch.alternate_logos = await Promise.all(
        alternateLogos.map((l) =>
          l.kind === "new" ? upload(l.file, "alternate") : l.url,
        ),
      );
    }

    return patch;
  }

  /** Fields that don't depend on an upload round trip. */
  function textFields() {
    const foundedYear = /^\d{4}$/.test(founded.trim())
      ? Number(founded.trim())
      : undefined;

    return {
      name: name.trim(),
      mcc: mcc.trim(),
      ...(status ? { status: status as CreateMerchantInput["status"] } : {}),
      ...(description.trim() ? { description: description.trim() } : {}),
      ...(website.trim() ? { website: website.trim() } : {}),
      ...(email.trim() ? { email: email.trim() } : {}),
      ...(phone.trim() ? { phone: phone.trim() } : {}),
      ...(headquarters.trim() ? { headquarters: headquarters.trim() } : {}),
      ...(country ? { country } : {}),
      ...(foundedYear ? { founded_year: foundedYear } : {}),
      ...(brandColorList.length ? { brand_colors: brandColorList } : {}),
      ...(industryGroup.trim() ? { industry_group: industryGroup.trim() } : {}),
      ...(mccDescription.trim()
        ? { mcc_description: mccDescription.trim() }
        : {}),
      ...(tags.length ? { tags } : {}),
    };
  }

  /**
   * Images can only be uploaded against an existing merchant, so on create the
   * merchant is saved first and the image URLs are PATCHed on afterwards.
   */
  async function handleSubmit() {
    if (!canSubmit || saving) return;
    setError("");
    setSaving(true);

    let token: string;
    let merchantId: string;
    try {
      token = await authStore.token();
      if (isEdit) {
        merchantId = initial.id;
        await merchantsApi.update(token, merchantId, textFields());
      } else {
        const aliasList = splitList(aliases);
        const created = await merchantsApi.create(token, {
          ...textFields(),
          ...(aliasList.length ? { aliases: aliasList } : {}),
        });
        merchantId = created.id;
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : `Failed to ${isEdit ? "save" : "add"} merchant`,
      );
      setSaving(false);
      return;
    }

    // The merchant is saved — an image failure past this point is partial, so
    // warn rather than stranding the user on a form that would duplicate it.
    try {
      const patch = await resolveImages(token, merchantId);
      if (Object.keys(patch).length) {
        await merchantsApi.update(token, merchantId, patch);
      }
      toast.success(
        isEdit ? "Merchant updated" : "Merchant created successfully",
      );
    } catch {
      toast.warning(
        `${name.trim()} was saved, but its images failed to upload.`,
      );
    }
    router.push(isEdit ? `/admin/merchants/${merchantId}` : "/admin/merchants");
  }

  const actions = (
    <>
      <Button variant="outline" onClick={() => router.push(backHref)}>
        Cancel
      </Button>
      <Button
        className="bg-neutral-900 hover:bg-neutral-800 text-white"
        onClick={handleSubmit}
        disabled={saving || !canSubmit}
      >
        {saving
          ? isEdit
            ? "Saving…"
            : "Creating…"
          : isEdit
            ? "Save changes"
            : "Create Merchant"}
      </Button>
    </>
  );

  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <div className="px-8 py-6 border-b border-neutral-200 flex items-center justify-between bg-white z-50">
        <div className="flex items-center gap-3">
          <Link
            href={backHref}
            className="text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-semibold text-neutral-900">
            {isEdit ? `Edit ${initial.name}` : "Add Merchant"}
          </h1>
        </div>
        <div className="flex items-center gap-3">{actions}</div>
      </div>

      <div className="flex-1 pb-12">
        <Section
          label="Merchant Information"
          description="Core identity of the merchant."
        >
          <div className="grid grid-cols-2 gap-5">
            <Field label="Merchant name">
              <Input
                placeholder="e.g. Starbucks Coffee"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <Field label="Status">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Logo" className="col-span-2">
              <ImageUpload
                value={logo}
                onChange={setLogo}
                placeholder="Upload logo (PNG, JPEG or WebP, max 1MB)"
              />
            </Field>
            <Field label="Description" className="col-span-2">
              <Textarea
                placeholder="Short description of the merchant..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </Field>
          </div>
        </Section>

        <Section
          label="Business Information"
          description="Contact and company details."
        >
          <div className="grid grid-cols-2 gap-5">
            <Field label="Website">
              <Input
                placeholder="https://www.business.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </Field>
            <Field label="Email">
              <Input
                type="email"
                placeholder="billing@business.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field label="Phone number">
              <Input
                placeholder="+233 20 000 0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Field>
            <Field label="Headquarters">
              <Input
                placeholder="e.g. Accra, Ghana"
                value={headquarters}
                onChange={(e) => setHeadquarters(e.target.value)}
              />
            </Field>
            <Field label="Country">
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
            </Field>
            <Field label="Founded (optional)">
              <Input
                placeholder="e.g. 1971"
                value={founded}
                onChange={(e) => setFounded(e.target.value)}
                maxLength={4}
              />
            </Field>
          </div>
        </Section>

        <Section
          label="Branding"
          description="Additional visual assets for this merchant."
        >
          <div className="grid grid-cols-2 gap-5">
            <Field label="Alternate logos" className="col-span-2">
              <MultiImageUpload
                values={alternateLogos}
                onChange={setAlternateLogos}
              />
            </Field>
            <Field label="Category icon" className="col-span-2">
              <ImageUpload
                value={categoryIcon}
                onChange={setCategoryIcon}
                placeholder="Upload category icon (PNG, JPEG or WebP, max 1MB)"
              />
            </Field>
            <Field
              label="Brand colors (optional)"
              className="col-span-2"
              hint="Comma-separated hex codes, e.g. #00704A, #FFFFFF"
            >
              <div className="flex items-center gap-3">
                <Input
                  placeholder="#00704A, #FFFFFF"
                  value={brandColors}
                  onChange={(e) => setBrandColors(e.target.value)}
                  className="flex-1"
                />
                {brandColorList.length > 0 && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    {brandColorList.map((c, i) => (
                      <span
                        key={`${c}-${i}`}
                        className="w-6 h-6 rounded-full border border-neutral-200"
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>
                )}
              </div>
            </Field>
          </div>
        </Section>

        <Section
          label="Classification"
          description="How this merchant is categorized."
        >
          <div className="grid grid-cols-2 gap-5">
            <Field label="Industry group">
              <Input
                placeholder="e.g. Food & Beverage"
                value={industryGroup}
                onChange={(e) => setIndustryGroup(e.target.value)}
              />
            </Field>
            <Field label="MCC code">
              <Input
                placeholder="4-digit code, e.g. 5814"
                value={mcc}
                onChange={(e) => setMcc(e.target.value)}
                maxLength={4}
              />
            </Field>
            <Field label="MCC description">
              <Input
                placeholder="e.g. Eating Places, Restaurants"
                value={mccDescription}
                onChange={(e) => setMccDescription(e.target.value)}
              />
            </Field>
            <Field label="Tags">
              <MultiSelect
                placeholder="Select tags"
                value={tags}
                onValueChange={setTags}
                options={TAG_OPTIONS}
              />
            </Field>
          </div>
        </Section>

        {!isEdit && (
          <Section
            label="Transaction Recognition"
            description="How this merchant appears in transaction descriptions."
          >
            <Field
              label="Aliases"
              hint="Comma-separated alternate names used to match this merchant, e.g. STARBUCKS, SBUX, STARBUCKS COFFEE"
            >
              <Input
                placeholder="STARBUCKS, SBUX, STARBUCKS COFFEE"
                value={aliases}
                onChange={(e) => setAliases(e.target.value)}
              />
            </Field>
          </Section>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 px-16 pt-6">
          {error && <p className="text-sm text-destructive mr-auto">{error}</p>}
          {actions}
        </div>
      </div>
    </div>
  );
}
