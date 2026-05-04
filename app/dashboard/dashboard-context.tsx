"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { projectsApi, type Project } from "@/lib/api";
import { authStore } from "@/lib/auth-store";

type DashboardContextType = {
  projects: Project[];
  loadingProjects: boolean;
  refreshProjects: () => Promise<void>;
  dialogOpen: boolean;
  setDialogOpen: (v: boolean) => void;
  headerContent: React.ReactNode;
  setHeaderContent: (content: React.ReactNode) => void;
};

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [headerContent, setHeaderContent] = useState<React.ReactNode>(null);

  const refreshProjects = useCallback(async () => {
    try {
      const token = await authStore.token();
      const res = await projectsApi.list(token);
      setProjects(res.data.projects);
    } catch {
      setProjects([]);
    } finally {
      setLoadingProjects(false);
    }
  }, []);

  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  return (
    <DashboardContext.Provider
      value={{ projects, loadingProjects, refreshProjects, dialogOpen, setDialogOpen, headerContent, setHeaderContent }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}
