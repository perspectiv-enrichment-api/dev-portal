"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProjectLogo } from "@/components/project-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Trash2, Pencil, Search, ListFilter, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboard } from "./dashboard-context";
import { projectsApi } from "@/lib/api";
import { authStore } from "@/lib/auth-store";
import { CreateProjectDialog } from "@/components/create-project-dialog";

const PAGE_SIZE = 10;

export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const { projects, loadingProjects, refreshProjects, dialogOpen, setDialogOpen } = useDashboard();
  const router = useRouter();

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  async function handleDelete(e: React.MouseEvent, projectId: string) {
    e.stopPropagation();
    try {
      const token = await authStore.token();
      await projectsApi.delete(token, projectId);
      refreshProjects();
    } catch {}
  }

  if (loadingProjects) {
    return <div className="flex-1 flex items-center justify-center text-sm text-neutral-400">Loading…</div>;
  }

  return (
    <div className="flex flex-col flex-1">
      {projects.length === 0 ? (
        <div className="flex-1 flex flex-col items-center overflow-hidden">
          <div className="relative w-full flex flex-col items-center px-[50px]">
            <Image
              src="/images/empty-state.svg"
              alt="No projects"
              width={750}
              height={300}
              className="w-full h-auto"
            />
            <div className="absolute bottom-[12%] translate-y-1/4 z-10 flex flex-col items-center gap-3 text-center bg-white px-8 py-6 rounded-2xl w-full">
              <h2 className="text-[30px]/[44px] tracking-[-2%] font-bold text-neutral-900">
                Create your first project!
              </h2>
              <span className="text-[16px]/[30px] text-neutral-600 tracking-[0%]">
                Create a project to access your API keys and start using
                Perspectiv in your product.
              </span>
              <Button
                size="lg"
                className="bg-neutral-900 hover:bg-neutral-800 text-white px-6"
                iconLeading={<Plus className="w-4 h-4" />}
                onClick={() => setDialogOpen(true)}
              >
                Get started
              </Button>
              <CreateProjectDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onCreated={refreshProjects}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 flex flex-col gap-4">
          {/* Toolbar */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-neutral-600 font-semibold h-10"
              iconLeading={<ListFilter className="w-3.5 h-3.5 font-semibold" />}
            >
              Filter
            </Button>
            <div className="relative w-125">
              <Search className="absolute left-3 top-[50%] -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-10 text-sm"
              />
            </div>
          </div>

          <div className="border border-neutral-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-50 hover:bg-neutral-50">
                  <TableHead className="px-4 text-xs text-neutral-600 font-medium">Project</TableHead>
                  <TableHead className="text-xs text-neutral-600 font-medium">Environment</TableHead>
                  <TableHead className="text-xs text-neutral-600 font-medium">Use case</TableHead>
                  <TableHead className="text-xs text-neutral-600 font-medium">Created on</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((project, i) => (
                  <TableRow
                    key={project.id}
                    onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                    className={cn(
                      i % 2 === 0 ? "bg-neutral-50" : "bg-white",
                      "cursor-pointer hover:bg-neutral-100",
                    )}
                  >
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <ProjectLogo name={project.name} logo={project.project_icon_url} size="sm" />
                        <span className="text-sm font-medium text-neutral-900">{project.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className={cn(
                        "text-xs font-medium px-2 py-0.5 rounded capitalize",
                        project.environment === "production"
                          ? "text-emerald-600 bg-emerald-50"
                          : "text-neutral-600 bg-neutral-100",
                      )}>
                        {project.environment}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 text-sm text-neutral-600 capitalize">
                      {project.use_case}
                    </TableCell>
                    <TableCell className="py-4 text-sm text-neutral-600">
                      {new Date(project.created_at).toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" })}
                    </TableCell>
                    <TableCell className="py-4 pr-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          className="text-neutral-400 hover:text-red-500 transition-colors"
                          onClick={(e) => handleDelete(e, project.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          className="text-neutral-400 hover:text-neutral-600 transition-colors"
                          onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/projects/${project.id}`); }}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200 bg-white">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled className="text-neutral-400">Previous</Button>
                <Button variant="outline" size="sm" disabled className="text-neutral-400">Next</Button>
              </div>
              <span className="text-xs text-neutral-600 font-semibold">
                Page 1 of {Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
