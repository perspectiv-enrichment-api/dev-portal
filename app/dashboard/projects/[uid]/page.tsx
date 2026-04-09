"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { mockProjects } from "@/lib/mock-data";
import { useDashboard } from "../../dashboard-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProjectLogo } from "@/components/project-logo";
import { Layers, ChevronRight, UploadCloud, CheckCircle } from "lucide-react";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ProjectDetailPage() {
  const { uid } = useParams<{ uid: string }>();
  const router = useRouter();
  const { setHeaderContent } = useDashboard();
  const project = mockProjects.find((p) => p.id === uid) ?? mockProjects[0];

  const [name, setName] = useState(project.name);
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHeaderContent(
      <>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <Layers className="w-4 h-4 text-neutral-400" />
          <Link href="/dashboard" className="text-neutral-500 hover:text-neutral-900">
            Projects
          </Link>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
          <span className="font-semibold text-neutral-900">{project.name}</span>
        </div>
        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Cancel
          </Button>
          <Button className="bg-neutral-900 hover:bg-neutral-800 text-white">
            Save changes
          </Button>
        </div>
      </>
    );
    return () => setHeaderContent(null);
  }, [project.name]);

  return (
    <div className="flex-1 overflow-auto divide-y divide-neutral-200">
      {/* API Credentials */}
      <Section
        label="API Credentials"
        description="Keys used to authenticate your app when making requests to the Perpectiv API."
      >
        <div className="flex flex-col gap-2 w-full max-w-lg">
          <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden">
            <span className="px-4 py-2.5 text-sm text-neutral-500 bg-white border-r border-neutral-200 shrink-0">
              API Key
            </span>
            <span className="px-4 py-2.5 text-sm font-mono text-neutral-700 bg-white">
              {project.apiKey}
            </span>
          </div>
          <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden">
            <span className="px-4 py-2.5 text-sm text-neutral-500 bg-white border-r border-neutral-200 shrink-0">
              API Secret
            </span>
            <span className="px-4 py-2.5 text-sm font-mono text-neutral-700 bg-white">
              {project.secretKey}
            </span>
          </div>
        </div>
      </Section>

      {/* Project name */}
      <Section label="Project name">
        <div className="relative w-full max-w-lg">
          <ProjectLogo
            name={project.name}
            logo={project.logo}
            size="sm"
            className="absolute left-3 top-1/2 -translate-y-1/2"
          />
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
        description="Helps you visually identify this project."
      >
        <div className="flex items-center gap-4">
          <ProjectLogo name={project.name} logo={project.logo} size="lg" />
          <button
            className={cn(
              "flex flex-col items-center justify-center gap-2 border border-neutral-200 rounded-lg w-96 h-28 cursor-pointer transition-colors",
              dragOver ? "bg-neutral-50 border-neutral-400" : "bg-white hover:bg-neutral-50"
            )}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
          >
            <UploadCloud className="w-6 h-6 text-neutral-400" />
            <p className="text-sm text-neutral-700">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-neutral-400">PNG, JPG or GIF (max. 800×400px)</p>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
        </div>
      </Section>

      {/* Environment */}
      <Section label="Environment">
        <Input
          value={project.environment}
          readOnly
          className="h-10 text-sm w-full max-w-lg text-neutral-500"
        />
      </Section>

      {/* Project status */}
      <Section
        label="Project status"
        description="The current state of your project"
      >
        <ToggleGroup.Root
          type="single"
          value={status}
          onValueChange={(v) => v && setStatus(v as "Active" | "Inactive")}
          className="flex w-full max-w-lg border border-neutral-200 rounded-lg overflow-hidden"
        >
          {(["Active", "Inactive"] as const).map((s) => (
            <ToggleGroup.Item
              key={s}
              value={s}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm transition-colors focus:outline-none",
                status === s
                  ? "bg-neutral-100 text-neutral-900 font-semibold"
                  : "bg-white text-neutral-500 font-medium hover:text-neutral-700"
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
    <div className="flex items-start gap-8 px-8 py-8">
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
