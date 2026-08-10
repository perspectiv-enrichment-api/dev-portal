"use client";

import { useRef, useState } from "react";
import { Box, Upload, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { projectsApi } from "@/lib/api";
import { authStore } from "@/lib/auth-store";
import {
  PROJECT_IMAGE_ACCEPT,
  validateProjectImage,
} from "@/lib/project-avatar";
import { toast } from "sonner";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

export function CreateProjectDialog({
  open,
  onOpenChange,
  onCreated,
}: CreateProjectDialogProps) {
  const [name, setName] = useState("");
  const [useCase, setUseCase] = useState<string[]>([]);
  const [environment, setEnvironment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [icon, setIcon] = useState<{ file: File; dataUrl: string } | null>(
    null,
  );
  const iconInputRef = useRef<HTMLInputElement>(null);

  const canSubmit = name.trim() && useCase.length > 0 && environment;

  function pickIcon(file: File) {
    const invalid = validateProjectImage(file);
    if (invalid) {
      setError(invalid);
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onload = () => setIcon({ file, dataUrl: reader.result as string });
    reader.readAsDataURL(file);
  }

  async function handleCreate() {
    if (!canSubmit) return;
    setError("");
    setLoading(true);
    try {
      const token = await authStore.token();
      const res = await projectsApi.create(token, { name: name.trim(), environment, use_case: useCase.join(",") });
      // The icon needs a project to attach to, so it is uploaded after create.
      // A failure here shouldn't discard the project the user just made.
      if (icon) {
        try {
          const projectId = res.data.project.id;
          const publicUrl = await projectsApi.uploadIcon(
            token,
            projectId,
            icon.file,
          );
          await projectsApi.update(token, projectId, {
            project_icon_url: publicUrl,
          });
        } catch {
          toast.error(
            "Project created, but the image upload failed. You can upload it from the project's page.",
          );
        }
      }
      setName("");
      setUseCase([]);
      setEnvironment("");
      setIcon(null);
      onOpenChange(false);
      onCreated?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create project");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-7 py-7 border-b border-neutral-200">
          <div className="w-11 h-11 rounded-lg border border-neutral-200 flex items-center justify-center shrink-0">
            <Box className="w-6 h-6 text-neutral-700" />
          </div>
          <DialogHeader className="gap-0.5 text-left">
            <DialogTitle className="text-base font-semibold text-neutral-900">
              Create new project
            </DialogTitle>
            <DialogDescription className="text-sm text-neutral-500">
              Enter the details of your project below.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="px-6 py-8 flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-neutral-900 w-32 shrink-0">
              Project name
            </label>
            <Input
              placeholder="Enter your project's name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-neutral-900 w-32 shrink-0">
              Use case
            </label>
            <MultiSelect
              className="flex-1"
              placeholder="Select use case"
              value={useCase}
              onValueChange={setUseCase}
              options={[
                { value: "personal_finance", label: "Personal finance & budgeting apps" },
                { value: "banking_fintech", label: "Banking & fintech platforms" },
                { value: "expense_management", label: "Expense management tools" },
                { value: "merchant_ecommerce", label: "Merchant / e-commerce analytics" },
                { value: "internal_analytics", label: "Internal analytics & reporting" },
                { value: "fraud_detection", label: "Fraud detection & risk systems" },
                { value: "customer_experience", label: "Customer experience & notifications" },
              ]}
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-neutral-900 w-32 shrink-0">
              Environment
            </label>
            <Select value={environment} onValueChange={setEnvironment}>
              <SelectTrigger className="flex-1 w-full">
                <SelectValue placeholder="Select environment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="production">Production</SelectItem>
                <SelectItem value="staging">Staging</SelectItem>
                <SelectItem value="development">Development</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-neutral-900 w-32 shrink-0">
              Project photo
            </label>
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <input
                  ref={iconInputRef}
                  type="file"
                  accept={PROJECT_IMAGE_ACCEPT}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    if (file) pickIcon(file);
                  }}
                />
                <div className="w-11 h-11 rounded-full border border-neutral-200 bg-white overflow-hidden flex items-center justify-center shrink-0">
                  {icon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={icon.dataUrl}
                      alt="Project photo preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Box className="w-5 h-5 text-neutral-400" />
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => iconInputRef.current?.click()}
                  iconLeading={<Upload className="w-4 h-4" />}
                >
                  {icon ? "Change image" : "Upload image"}
                </Button>
                {icon && (
                  <button
                    type="button"
                    onClick={() => setIcon(null)}
                    className="text-neutral-400 hover:text-neutral-600 shrink-0"
                    aria-label="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {!icon && (
                <span className="text-xs text-neutral-500">
                  Optional — one is generated for you.
                </span>
              )}
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-neutral-200">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
            size="lg"
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white"
            onClick={handleCreate}
            size="lg"
            disabled={loading || !canSubmit}
          >
            {loading ? "Creating…" : "Create Project"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
