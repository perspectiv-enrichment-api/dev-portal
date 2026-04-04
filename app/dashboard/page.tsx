'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getAnalytics, mockDeveloper, mockAPIKeys, tierLimits } from '@/lib/mock-data'
import { TrendingUp, Key, AlertCircle, Activity } from 'lucide-react'

export default function DashboardPage() {
  const analytics = getAnalytics()
  const tierLimit = tierLimits[mockDeveloper.plan]

  const monthProgress = (analytics.totalRequests / (tierLimit.requestsPerMonth as number)) * 100

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, Alex</h1>
        <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your API today.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent mb-2">{analytics.totalRequests.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">API requests</div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent mb-2">{analytics.successRate}%</div>
            <div className="text-xs text-muted-foreground">{analytics.successfulRequests} successful</div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Latency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent mb-2">{analytics.averageLatency}ms</div>
            <div className="text-xs text-muted-foreground">Response time</div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Keys</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent mb-2">{mockAPIKeys.filter((k) => k.status === 'active').length}</div>
            <div className="text-xs text-muted-foreground">API keys</div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Progress */}
      <Card className="bg-card/50 backdrop-blur border-border">
        <CardHeader>
          <CardTitle>Monthly Usage</CardTitle>
          <CardDescription>API calls this month</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-foreground">{analytics.totalRequests.toLocaleString()} / {(tierLimit.requestsPerMonth as number).toLocaleString()} requests</span>
              <span className="text-muted-foreground">{monthProgress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-accent h-full transition-all rounded-full"
                style={{ width: `${Math.min(monthProgress, 100)}%` }}
              />
            </div>
          </div>
          {monthProgress > 80 && (
            <div className="flex gap-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-destructive">Approaching limit</p>
                <p className="text-muted-foreground">You&apos;re using {monthProgress.toFixed(0)}% of your monthly quota.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Merchants */}
        <Card className="lg:col-span-2 bg-card/50 backdrop-blur border-border">
          <CardHeader>
            <CardTitle>Top Merchants</CardTitle>
            <CardDescription>Most enriched merchants this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(analytics.merchantCounts)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .slice(0, 5)
                .map(([merchant, count]) => (
                  <div key={merchant} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                    <span className="text-foreground font-medium">{merchant}</span>
                    <span className="text-muted-foreground">{count} requests</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Plan Info */}
        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader>
            <CardTitle className="capitalize">{mockDeveloper.plan} Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Rate Limit</p>
                <p className="font-semibold text-foreground">{(tierLimit.rateLimit as number).toLocaleString()} req/s</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Monthly Limit</p>
                <p className="font-semibold text-foreground">{(tierLimit.requestsPerMonth as number).toLocaleString()} calls</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Billing Cycle</p>
                <p className="font-semibold text-foreground">Monthly</p>
              </div>
            </div>
            <Link href="/dashboard/settings" className="block">
              <Button variant="outline" className="w-full">
                Upgrade Plan
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/dashboard/keys" className="block">
          <Card className="bg-card/50 backdrop-blur border-border hover:border-accent/50 cursor-pointer transition-colors h-full">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground mb-1">API Keys</h3>
                  <p className="text-sm text-muted-foreground">Manage your API keys and credentials</p>
                </div>
                <Key className="w-8 h-8 text-accent flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/analytics" className="block">
          <Card className="bg-card/50 backdrop-blur border-border hover:border-accent/50 cursor-pointer transition-colors h-full">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Analytics</h3>
                  <p className="text-sm text-muted-foreground">View detailed usage and performance metrics</p>
                </div>
                <Activity className="w-8 h-8 text-accent flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
