"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDashboard } from "../../dashboard-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProjectLogo } from "@/components/project-logo";
import { Layers, ChevronRight, UploadCloud, CheckCircle, Box } from "lucide-react";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { projectsApi, type Project } from "@/lib/api";
import { authStore } from "@/lib/auth-store";

export default function ProjectDetailPage() {
  const { uid } = useParams<{ uid: string }>();
  const router = useRouter();
  const { setHeaderContent, refreshProjects } = useDashboard();

  const [project, setProject] = useState<Project | null>(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("active");
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    authStore.token().then((token) =>
      projectsApi.get(token, uid).then((res) => {
        const p = res.data.project;
        setProject(p);
        setName(p.name);
        setStatus(p.status);
      })
    );
  }, [uid]);

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
          <Link href="/dashboard" className="text-neutral-500 hover:text-neutral-900">
            Projects
          </Link>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
          <span className="font-semibold text-neutral-900">{project.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white hover:text-primary" onClick={() => router.push("/dashboard")}>
            Cancel
          </Button>
          <Button className="bg-neutral-900 hover:bg-neutral-800 text-white" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </>,
    );
    return () => setHeaderContent(null);
  }, [project, name, status, saving]);

  if (!project) {
    return <div className="flex-1 flex items-center justify-center text-sm text-neutral-400">Loading…</div>;
  }

  return (
    <div className="flex-1 overflow-auto">
      {/* Project name */}
      <Section label="Project name">
        <div className="relative w-full max-w-lg">
          <Box className="absolute left-3 top-[50%] -translate-y-1/2 w-4 h-4 text-[#737373]" />
          <Input value={name} onChange={(e) => setName(e.target.value)} className="pl-10 h-10 text-sm" />
        </div>
      </Section>

      {/* Project photo */}
      <Section label="Project photo" description="Helps you visually identify this project.">
        <div className="flex items-center gap-4">
          <ProjectLogo name={project.name} logo={project.project_icon_url} size="lg" />
          <button
            className={cn(
              "flex flex-col items-center justify-center gap-2 border border-neutral-200 rounded-lg w-96 h-28 cursor-pointer transition-colors",
              dragOver ? "bg-neutral-50 border-neutral-400" : "bg-white hover:bg-neutral-50",
            )}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
          >
            <div className="border border-neutral-200 rounded-lg p-1">
              <UploadCloud className="w-5 h-5 text-[#737373]" />
            </div>
            <p className="text-xs">
              <span className="text-sm font-semibold text-neutral-700">Click to upload</span>{" "}or drag and drop
            </p>
            <p className="text-xs">PNG, JPG or GIF (max. 800×400px)</p>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
        </div>
      </Section>

      {/* Environment */}
      <Section label="Environment">
        <Input value={project.environment} readOnly className="h-10 text-sm w-full max-w-lg text-neutral-500 capitalize" />
      </Section>

      {/* Use case */}
      <Section label="Use case">
        <Input value={project.use_case} readOnly className="h-10 text-sm w-full max-w-lg text-neutral-500 capitalize" />
      </Section>

      {/* Project status */}
      <Section label="Project status" description="The current state of your project">
        <ToggleGroup.Root
          type="single"
          value={status}
          onValueChange={(v) => v && setStatus(v)}
          className="flex w-full max-w-lg border border-neutral-200 rounded-lg overflow-hidden"
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
              {status === s && <CheckCircle className="w-4 h-4 text-neutral-600" />}
            </ToggleGroup.Item>
          ))}
        </ToggleGroup.Root>
      </Section>
    </div>
  );
}

function Section({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8 px-8 py-8 border-b-2 border-neutral-100 mx-8 last:border-b-0">
      <div className="w-56 shrink-0">
        <p className="text-sm font-semibold text-neutral-900">{label}</p>
        {description && <p className="text-sm text-neutral-500 mt-0.5">{description}</p>}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
