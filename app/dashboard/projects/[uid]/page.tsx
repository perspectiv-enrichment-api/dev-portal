"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDashboard } from "../../dashboard-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProjectLogo } from "@/components/project-logo";
import { Layers, ChevronRight, CheckCircle, Box, Copy, KeyRound } from "lucide-react";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { keysApi, projectsApi, type ApiKey, type Project } from "@/lib/api";
import { authStore } from "@/lib/auth-store";
import { projectDicebearUrl } from "@/lib/project-avatar";

export default function ProjectDetailPage() {
  const { uid } = useParams<{ uid: string }>();
  const router = useRouter();
  const { setHeaderContent, refreshProjects } = useDashboard();

  const [project, setProject] = useState<Project | null>(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("active");
  const [saving, setSaving] = useState(false);
  const [regeneratingLogo, setRegeneratingLogo] = useState(false);
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [keysLoading, setKeysLoading] = useState(true);
  const [generatedKey, setGeneratedKey] = useState("");
  const [creatingKey, setCreatingKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [keyError, setKeyError] = useState("");

  useEffect(() => {
    authStore.token().then((token) =>
      projectsApi.get(token, uid).then((res) => {
        const p = res.data.project;
        setProject(p);
        setName(p.name);
        setStatus(p.status);
      }),
    );
  }, [uid]);

  useEffect(() => {
    const loadKeys = async () => {
      if (!project) return;
      setKeysLoading(true);
      setKeyError("");
      try {
        const token = await authStore.token();
        const { keys: data } = await keysApi.list(token);
        setKeys(data.filter((k) => k.project_id === project.id));
      } catch {
        setKeyError("Failed to load API credentials");
      } finally {
        setKeysLoading(false);
      }
    };

    loadKeys();
  }, [project]);

  const handleSave = async () => {
    if (!project) return;
    setSaving(true);
    try {
      const token = await authStore.token();
      const res = await projectsApi.update(token, project.id, { name, status });
      setProject(res.data.project);
      await refreshProjects();
      router.push("/dashboard");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (!project) return;
    setHeaderContent(
      <>
        <div className="flex items-center gap-2 text-sm">
          <Layers className="w-4 h-4 text-neutral-400" />
          <Link
            href="/dashboard"
            className="text-neutral-500 hover:text-neutral-900"
          >
            Projects
          </Link>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
          <span className="font-semibold text-neutral-900">{project.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="bg-white hover:text-primary"
            onClick={() => router.push("/dashboard")}
          >
            Cancel
          </Button>
          <Button
            className="bg-neutral-900 hover:bg-neutral-800 text-white"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </>,
    );
    return () => setHeaderContent(null);
  }, [project, name, status, saving]);

  if (!project) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-neutral-400">
        Loading…
      </div>
    );
  }

  const activeKey = keys.find((k) => !k.revoked) ?? keys[0] ?? null;
  const keyDisplay = generatedKey
    ? generatedKey
    : activeKey
      ? `${activeKey.key_prefix}••••••••••••••••`
      : "";

  const handleCreateKey = async () => {
    if (!project) return;
    setCreatingKey(true);
    setKeyError("");
    try {
      const token = await authStore.token();
      const { key } = await keysApi.create(
        token,
        `${project.name} key`,
        project.id,
      );
      setGeneratedKey(key.key ?? "");
      setKeys((prev) => [key, ...prev]);
    } catch (err: unknown) {
      setKeyError(
        err instanceof Error ? err.message : "Failed to generate key",
      );
    } finally {
      setCreatingKey(false);
    }
  };

  const handleCopy = async (value: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
    if (value === generatedKey) setGeneratedKey("");
  };

  const handleRegenerateLogo = async () => {
    if (!project) return;
    setRegeneratingLogo(true);
    try {
      const token = await authStore.token();
      const seed = `${project.id}-${Date.now()}-${Math.random()}`;
      const nextLogoUrl = projectDicebearUrl(seed);
      const res = await projectsApi.update(token, project.id, {
        project_icon_url: nextLogoUrl,
      });
      setProject(res.data.project);
      await refreshProjects();
    } finally {
      setRegeneratingLogo(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      {/* API credentials */}
      <Section
        label="API Credentials"
        description="Keys used to authenticate your app when making requests to the Perspectiv API."
      >
        <div className="grid gap-3 max-w-xl">
          <div className="flex items-center border border-neutral-200 rounded-lg bg-white overflow-hidden h-10">
            <span className="px-3 text-sm text-neutral-500 border-r border-neutral-200 h-full flex items-center shrink-0">
              API Key
            </span>
            <input
              value={keyDisplay}
              readOnly
              placeholder={keysLoading ? "Loading…" : "No API key yet"}
              className="flex-1 px-3 text-sm font-mono bg-transparent outline-none text-neutral-700"
            />
          </div>

          {keyError && <p className="text-sm text-destructive">{keyError}</p>}

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="gap-2 hover:text-neutral-900 hover:bg-neutral-100"
              onClick={handleCreateKey}
              disabled={creatingKey}
              iconLeading={<KeyRound className="w-4 h-4" />}
            >
              {/* <KeyRound className="w-4 h-4" /> */}
              {creatingKey ? "Generating…" : "Generate new key"}
            </Button>
            {keyDisplay && (
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "gap-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100",
                  copied ? "text-green-600" : "text-neutral-500",
                )}
                onClick={() => handleCopy(keyDisplay)}
                iconLeading={<Copy className="w-3.5 h-3.5" />}
              >
                {copied ? "Copied" : "Copy key"}
              </Button>
            )}
            {generatedKey && (
              <span className="text-xs text-muted-foreground">
                Copy this key now. You will not see it again.
              </span>
            )}
          </div>
        </div>
      </Section>

      {/* Project name */}
      <Section label="Project name">
        <div className="relative w-full max-w-xl">
          <Box className="absolute left-3 top-[50%] -translate-y-1/2 w-4 h-4 text-[#737373]" />
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pl-10 h-10 text-sm"
          />
        </div>
      </Section>

      {/* Project photo */}
      <Section
        label="Project photo"
        description="Regenerate a new Dicebear image if you want a fresh look."
      >
        <div className="flex items-center gap-4 w-full max-w-xl">
          <ProjectLogo
            name={project.name}
            logo={project.project_icon_url}
            size="lg"
          />
          <div className="flex-1">
            <Button
              variant="outline"
              className="gap-2 hover:text-neutral-900 hover:bg-neutral-100"
              onClick={handleRegenerateLogo}
              disabled={regeneratingLogo}
            >
              {regeneratingLogo ? "Regenerating…" : "Regenerate image"}
            </Button>
          </div>
        </div>
      </Section>

      {/* Environment */}
      <Section label="Environment">
        <div className="w-full max-w-xl">
          <Input
            value={
              project.environment
                ? project.environment.charAt(0).toUpperCase() +
                  project.environment.slice(1)
                : ""
            }
            readOnly
            className="h-10 text-sm w-full text-neutral-500"
          />
        </div>
      </Section>

      {/* Project status */}
      <Section
        label="Project status"
        description="The current state of your project"
      >
        <ToggleGroup.Root
          type="single"
          value={status}
          onValueChange={(v) => v && setStatus(v)}
          className="flex w-full max-w-xl border border-neutral-200 rounded-lg overflow-hidden"
        >
          {(["active", "inactive"] as const).map((s) => (
            <ToggleGroup.Item
              key={s}
              value={s}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm transition-colors focus:outline-none capitalize",
                status === s
                  ? "bg-neutral-100 text-neutral-900 font-semibold"
                  : "bg-white text-neutral-500 font-medium hover:text-neutral-700",
              )}
            >
              {s}
              {status === s && (
                <CheckCircle className="w-4 h-4 text-neutral-600" />
              )}
            </ToggleGroup.Item>
          ))}
        </ToggleGroup.Root>
      </Section>
    </div>
  );
}

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
