"use client";

import { useState } from "react";
import { Box } from "lucide-react";
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
import { projectsApi } from "@/lib/api";
import { authStore } from "@/lib/auth-store";

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
  const [useCase, setUseCase] = useState("");
  const [environment, setEnvironment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = name.trim() && useCase && environment;

  async function handleCreate() {
    if (!canSubmit) return;
    setError("");
    setLoading(true);
    try {
      const token = await authStore.token();
      await projectsApi.create(token, { name: name.trim(), environment, use_case: useCase });
      setName("");
      setUseCase("");
      setEnvironment("");
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
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
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
            <Select value={useCase} onValueChange={setUseCase}>
              <SelectTrigger className="flex-1 w-full">
                <SelectValue placeholder="Select use case" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="analytics">Analytics</SelectItem>
                <SelectItem value="ecommerce">E-commerce</SelectItem>
                <SelectItem value="fintech">Fintech</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
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
