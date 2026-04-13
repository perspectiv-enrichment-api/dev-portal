"use client";

import { Button } from "@/components/ui/button";
import { ProjectLogo } from "@/components/project-logo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  BarChart3,
  Globe,
  Key,
  Shield,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/auth/auth-navbar";
import { BrandMarquee } from "@/components/brand-marquee";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-25">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 text-balance">
            Enrich Your Transactions with Merchant Data
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
            Get complete merchant logos, details, and metadata with just a
            merchant name. Integrate in minutes, not days.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/signup">
              <Button
                size="lg"
                className="gap-2"
                iconTrailing={<ArrowRight className="w-4 h-4" />}
              >
                Get Started
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              View Documentation
            </Button>
          </div>
        </div>

        {/* Stats */}
        {/* <div className="grid md:grid-cols-4 gap-4 mb-16">
          {[
            { label: "API Calls", value: "2.5M+" },
            { label: "Active Developers", value: "5K+" },
            { label: "Uptime", value: "99.99%" },
            { label: "Response Time", value: "<150ms" },
          ].map((stat) => (
            <Card
              key={stat.label}
              className="bg-card/50 backdrop-blur border-border"
            >
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-accent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div> */}

        {/* Feature Grid */}
        {/* <div className="grid md:grid-cols-3 gap-8 my-20">
          {[
            {
              icon: <Zap className="w-8 h-8" />,
              title: "Lightning Fast",
              description:
                "Get merchant data in under 150ms with our optimized API endpoints.",
            },
            {
              icon: <Shield className="w-8 h-8" />,
              title: "Enterprise Security",
              description:
                "API key management, rate limiting, and comprehensive audit logs.",
            },
            {
              icon: <Globe className="w-8 h-8" />,
              title: "Global Coverage",
              description:
                "Merchant data across 150+ countries with real-time enrichment.",
            },
            {
              icon: <TrendingUp className="w-8 h-8" />,
              title: "Advanced Analytics",
              description:
                "Track usage, monitor costs, and analyze merchant distribution.",
            },
            {
              icon: <Key className="w-8 h-8" />,
              title: "Easy Integration",
              description:
                "Simple REST API with comprehensive documentation and SDKs.",
            },
            {
              icon: <BarChart3 className="w-8 h-8" />,
              title: "Detailed Insights",
              description:
                "Geographic breakdown, latency metrics, and cost attribution.",
            },
          ].map((feature, i) => (
            <Card
              key={i}
              className="bg-card/50 backdrop-blur border-border hover:border-accent/50 transition-colors"
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 text-accent">
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div> */}

        {/* Pricing Section */}
        {/* <div className="my-20">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
            Simple, Transparent Pricing
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                name: "Free",
                price: "$0",
                requests: "10K/month",
                rateLimit: "100 req/s",
                features: [
                  "API Key Management",
                  "Basic Analytics",
                  "Email Support",
                ],
              },
              {
                name: "Starter",
                price: "$29",
                requests: "100K/month",
                rateLimit: "1K req/s",
                features: [
                  "100K API Calls",
                  "Advanced Analytics",
                  "Priority Support",
                  "Webhooks",
                ],
              },
              {
                name: "Pro",
                price: "$99",
                requests: "1M/month",
                rateLimit: "10K req/s",
                popular: true,
                features: [
                  "1M API Calls",
                  "Real-time Analytics",
                  "24/7 Support",
                  "Custom Integrations",
                ],
              },
              {
                name: "Enterprise",
                price: "Custom",
                requests: "10M+/month",
                rateLimit: "100K req/s",
                features: [
                  "Unlimited Calls",
                  "Dedicated Support",
                  "SLA Guarantee",
                  "Custom Contracts",
                ],
              },
            ].map((plan, i) => (
              <Card
                key={i}
                className={`relative ${plan.popular ? "md:scale-105 border-accent bg-card" : "bg-card/50"} border-border`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-accent">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="py-4 border-t border-b border-border">
                    <p className="font-semibold text-foreground">
                      {plan.requests}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {plan.rateLimit}
                    </p>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, j) => (
                      <li
                        key={j}
                        className="flex gap-2 text-sm text-muted-foreground"
                      >
                        <span className="text-accent">✓</span> {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div> */}

        {/* CTA Section */}
        {/* <div className="bg-card rounded-lg border border-border p-12 text-center my-20">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to get started?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of developers using Perspectiv to enrich their
            transaction data.
          </p>
          <Link href="/signup">
            <Button size="lg">Create Free Account</Button>
          </Link>
        </div> */}
      </section>

      <BrandMarquee />

      {/* Footer */}
      <footer className=" bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ProjectLogo className="w-8 h-8" />
                <span className="font-bold text-foreground">Perspectiv</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Merchant enrichment for developers
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Features</li>
                <li>Pricing</li>
                <li>API Docs</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About</li>
                <li>Blog</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Privacy</li>
                <li>Terms</li>
                <li>Status</li>
              </ul>
            </div>
          </div> */}
          <div className=" pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2026 Perspectiv. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-accent transition-colors">
                Twitter
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                GitHub
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
