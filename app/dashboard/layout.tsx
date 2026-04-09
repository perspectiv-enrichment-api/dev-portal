"use client";

import { cn } from "@/lib/utils";
import { mockDeveloper } from "@/lib/mock-data";
import { ProjectLogo } from "@/components/project-logo";
import { Layers, FileText, Settings, LogOut, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { DashboardProvider, useDashboard } from "./dashboard-context";
import { Button } from "@/components/ui/button";
import { CreateProjectDialog } from "@/components/create-project-dialog";

const navItems = [
  { href: "/dashboard", label: "Projects", icon: Layers },
  {
    href: "/dashboard/docs",
    label: "API Docs",
    icon: FileText,
    external: true,
  },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function DashboardHeader() {
  const { hasProjects, setHasProjects, dialogOpen, setDialogOpen, headerContent } = useDashboard();

  if (headerContent) {
    return (
      <div className="px-8 py-6 border-b border-neutral-200 flex items-center justify-between bg-white z-50">
        {headerContent}
      </div>
    );
  }

  return (
    <div className="px-8 py-6 border-b border-neutral-200 flex items-center justify-between bg-white z-50">
      <h1 className="text-xl font-semibold text-neutral-900">Projects</h1>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setHasProjects(!hasProjects)}
          className="text-xs text-neutral-400 hover:text-neutral-600 underline underline-offset-2"
        >
          {hasProjects ? "Show empty state" : "Show projects"}
        </button>
        {hasProjects && (
          <>
            <Button
              className="bg-neutral-900 hover:bg-neutral-800 text-white gap-1.5"
              iconLeading={<Plus className="w-4 h-4" />}
              onClick={() => setDialogOpen(true)}
            >
              New Project
            </Button>
            <CreateProjectDialog open={dialogOpen} onOpenChange={setDialogOpen} />
          </>
        )}
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <DashboardProvider>
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-[280px] flex flex-col border-r border-neutral-200 bg-white shrink-0">
        {/* Logo */}
        <div className="h-24 flex items-center px-6">
          <Link href="/">
            <Image
              src="/images/logos/logo-with-text.svg"
              alt="Perspectiv"
              width={170}
              height={48}
            />
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                className={cn(
                  "flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-neutral-100 text-neutral-900"
                    : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900",
                )}
              >
                <span className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  {item.label}
                </span>
                {item.external && (
                  <svg
                    className="w-3.5 h-3.5 text-neutral-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-neutral-200">
          <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-md hover:bg-neutral-50 group">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-semibold text-neutral-600 shrink-0">
                {mockDeveloper.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">
                  {mockDeveloper.name}
                </p>
                <p className="text-xs text-neutral-500 truncate">
                  {mockDeveloper.email}
                </p>
              </div>
            </div>
            <button className="text-neutral-400 hover:text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto flex flex-col">
        <DashboardHeader />
        {children}
      </main>
    </div>
    </DashboardProvider>
  );
}
