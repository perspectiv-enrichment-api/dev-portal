"use client";

import { cn } from "@/lib/utils";
import { Store, ArrowLeft, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { authStore, dicebearUrl } from "@/lib/auth-store";
import { isAdminRole } from "@/lib/roles";
import type { User } from "@/lib/api";

const navItems = [{ href: "/admin/merchants", label: "Merchants", icon: Store }];

function SidebarUser({ user }: { user: User | null }) {
  const router = useRouter();

  const handleLogout = () => {
    authStore.clear();
    toast.success("Signed out successfully");
    router.push("/auth/login");
  };

  return (
    <div className="p-3">
      <div className="flex items-center justify-between gap-3 px-3 py-5 border border-neutral-200 rounded-md hover:bg-neutral-50 group">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full border border-primary bg-neutral-200 overflow-hidden shrink-0">
            <Image
              src={dicebearUrl(user?.email ?? "default")}
              alt={user?.name ?? "User"}
              width={32}
              height={32}
              className="w-full h-full"
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-neutral-900 truncate">
              {user?.name ?? "—"}
            </p>
            <p className="text-xs text-neutral-500 truncate">
              {user?.email ?? "—"}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-neutral-400 group-hover:shrink-0 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const current = authStore.getUser();
    if (!current || !isAdminRole(current.role)) {
      router.replace(current ? "/dashboard" : "/auth/login");
      return;
    }
    setUser(current);
    setAuthorized(true);
  }, [router]);

  if (!authorized) return null;

  return (
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

        <div className="px-6 pb-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Admin
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-neutral-100 text-neutral-900"
                    : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900",
                )}
              >
                <Icon className="w-4 h-4 text-[#A3A3A3]" />
                <span className="text-neutral-900">{item.label}</span>
              </Link>
            );
          })}

          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#A3A3A3]" />
            <span className="text-neutral-900">Back to Dashboard</span>
          </Link>
        </nav>

        <SidebarUser user={user} />
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto flex flex-col">{children}</main>
    </div>
  );
}
