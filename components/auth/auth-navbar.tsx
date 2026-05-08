"use client";

import { useAuth } from "@/lib/auth-context";
import { dicebearUrl } from "@/lib/auth-store";
import { ProjectLogo } from "../project-logo";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";

export const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center border-b border-secondary bg-background/80 backdrop-blur">
      <div className="w-full px-[6%] sm:px-[14%] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <ProjectLogo />
          <nav className="hidden sm:flex items-center">
            <Button href="/auth/register" variant="link" size="default">
              API Documentation
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <Link href="/dashboard" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-neutral-200 border border-neutral-300 overflow-hidden shrink-0">
                <Image
                  src={dicebearUrl(user.email)}
                  alt={user.name}
                  width={32}
                  height={32}
                  className="w-full h-full"
                />
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:block">{user.name}</span>
            </Link>
          ) : (
            <>
              <Button
                href="/auth/login"
                variant="outline"
                size="sm"
                className="bg-white hover:text-primary"
              >
                Log in
              </Button>
              <Button href="/auth/register" variant="default" size="sm">
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
