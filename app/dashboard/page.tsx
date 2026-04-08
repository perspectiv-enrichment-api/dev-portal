"use client";

import { useState } from "react";
import { mockProjects } from "@/lib/mock-data";
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
import {
  Trash2,
  Pencil,
  SlidersHorizontal,
  Search,
  Plus,
  ListFilter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateProjectDialog } from "@/components/create-project-dialog";

const PAGE_SIZE = 10;

const orbitingLogos = [
  {
    src: "https://logo.clearbit.com/grammarly.com",
    alt: "Grammarly",
    style: "top-[8%] left-[38%]",
  },
  {
    src: "https://logo.clearbit.com/apple.com",
    alt: "Apple",
    style: "top-[8%] right-[30%]",
  },
  {
    src: "https://logo.clearbit.com/snapchat.com",
    alt: "Snapchat",
    style: "top-[38%] left-[28%]",
  },
  {
    src: "https://logo.clearbit.com/cashapp.com",
    alt: "Cash App",
    style: "top-[42%] left-[14%]",
  },
  {
    src: "https://logo.clearbit.com/easypaisa.com.pk",
    alt: "eP",
    style: "top-[18%] right-[14%]",
  },
  {
    src: "https://logo.clearbit.com/yahoo.com",
    alt: "Yahoo",
    style: "top-[42%] right-[22%]",
  },
];

export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const [hasProjects, setHasProjects] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = mockProjects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-8 py-6 border-b border-neutral-200 flex items-center justify-between bg-white z-50">
        <h1 className="text-xl font-semibold text-neutral-900">Projects</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setHasProjects((v) => !v)}
            className="text-xs text-neutral-400 hover:text-neutral-600 underline underline-offset-2"
          >
            {hasProjects ? "Show empty state" : "Show projects"}
          </button>
          {hasProjects && (
            <>
              {" "}
              <Button
                className="bg-neutral-900 hover:bg-neutral-800 text-white gap-1.5"
                iconLeading={<Plus className="w-4 h-4" />}
                onClick={() => setDialogOpen(true)}
              >
                New Project
              </Button>
              <CreateProjectDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
              />
            </>
          )}
        </div>
      </div>

      {!hasProjects ? (
        <div className="flex-1 flex items-center justify-center">
          <div
            className="relative flex flex-col items-center"
            style={{ width: 1200, height: 620 }}
          >
            <Image
              src="/images/empty-state.svg"
              alt="No projects"
              width={981}
              height={620}
              className="fixed top-[6%]"
            />

            <div className="absolute -mt-[20px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-center w-80 bg-white z-10 pt-6 w-full">
              <h2 className="text-[30px]/[44px] tracking-[-2%] font-bold text-neutral-900">
                Create your first project!
              </h2>
              <span className="text-[16px]/[30px] text-neutral-600 tracking-[0%]">
                Create a project to access your API keys and start using
                Perspectiv in your product.
              </span>
              <Button
                size={"lg"}
                className="bg-neutral-900 hover:bg-neutral-800 text-white px-6"
                onClick={() => setHasProjects(true)}
              >
                Get started
              </Button>
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
            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-50 hover:bg-neutral-50">
                  <TableHead className="px-4 text-xs text-neutral-600 font-medium">
                    Project
                  </TableHead>
                  <TableHead className="text-xs text-neutral-600 font-medium">
                    Environment
                  </TableHead>
                  <TableHead className="text-xs text-neutral-600 font-medium">
                    Created on
                  </TableHead>
                  <TableHead className="text-xs text-neutral-600 font-medium">
                    API Key and Secret Key
                  </TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((project, i) => (
                  <TableRow
                    key={project.id}
                    className={i % 2 === 0 ? "bg-neutral-50" : "bg-white"}
                  >
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <ProjectLogo
                          name={project.name}
                          logo={project.logo}
                          size="sm"
                        />
                        <span className="text-sm font-medium text-neutral-900">
                          {project.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span
                        className={cn(
                          "text-xs font-medium px-2 py-0.5 rounded",
                          project.environment === "Production"
                            ? "text-emerald-600 bg-emerald-50"
                            : "text-neutral-600 bg-neutral-100",
                        )}
                      >
                        {project.environment}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 text-sm text-neutral-600">
                      {project.createdAt}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="font-mono text-xs text-neutral-700 leading-5">
                        <div>{project.apiKey}</div>
                        <div>{project.secretKey}</div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 pr-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button className="text-neutral-400 hover:text-neutral-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="text-neutral-400 hover:text-neutral-600 transition-colors">
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
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="text-neutral-400"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="text-neutral-400"
                >
                  Next
                </Button>
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
