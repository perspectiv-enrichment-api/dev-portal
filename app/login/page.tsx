"use client";

import { Button } from "@/components/ui/button";
import { ProjectLogo } from "@/components/project-logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Chrome, Github } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card flex items-center justify-center px-4">
      {/* Navigation */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-foreground hover:text-accent transition-colors"
      >
        <ProjectLogo className="w-8 h-8" />
        <span className="text-lg font-bold">Perspectiv</span>
      </Link>

      <div className="w-full max-w-md">
        <Card className="bg-card border-border">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your Perspectiv account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Login Form */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <Link
                  href="#"
                  className="text-accent hover:text-accent/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Link href="/dashboard">
              <Button className="w-full">Sign In</Button>
            </Link>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* OAuth Options */}
            <div className="space-y-3">
              <Button variant="outline" className="w-full gap-2">
                <Github className="w-4 h-4" />
                GitHub
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <Chrome className="w-4 h-4" />
                Google
              </Button>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-accent hover:text-accent/80 transition-colors font-medium"
              >
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Trust Badges */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>Enterprise-grade security • 99.99% uptime • GDPR compliant</p>
        </div>
      </div>
    </div>
  );
}
