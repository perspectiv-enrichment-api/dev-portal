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
import { Check, Chrome, Github } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
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
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>
              Get started with Perspectiv in minutes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Signup Form */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
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
                  Company
                </label>
                <input
                  type="text"
                  placeholder="Your Company"
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
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm text-muted-foreground">
                  I agree to the{" "}
                  <Link href="#" className="text-accent hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-accent hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            <Link href="/dashboard">
              <Button className="w-full">Create Account</Button>
            </Link>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">
                  Or sign up with
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

            {/* Login Link */}
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-accent hover:text-accent/80 transition-colors font-medium"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Features List */}
        <div className="mt-8 space-y-3">
          {[
            "Free tier with 10K API calls/month",
            "99.99% uptime SLA",
            "Real-time analytics and monitoring",
            "24/7 developer support",
          ].map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-3 text-sm text-muted-foreground"
            >
              <Check className="w-4 h-4 text-accent flex-shrink-0" />
              {feature}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
