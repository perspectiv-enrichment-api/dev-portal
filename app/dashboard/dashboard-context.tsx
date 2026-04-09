"use client";

import { createContext, useContext, useState } from "react";

type DashboardContextType = {
  hasProjects: boolean;
  setHasProjects: (v: boolean) => void;
  dialogOpen: boolean;
  setDialogOpen: (v: boolean) => void;
  headerContent: React.ReactNode;
  setHeaderContent: (content: React.ReactNode) => void;
};

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [hasProjects, setHasProjects] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [headerContent, setHeaderContent] = useState<React.ReactNode>(null);

  return (
    <DashboardContext.Provider
      value={{ hasProjects, setHasProjects, dialogOpen, setDialogOpen, headerContent, setHeaderContent }}
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
