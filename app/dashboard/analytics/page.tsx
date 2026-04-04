"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAnalytics, mockUsageLogs } from "@/lib/mock-data";
import { Download } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function AnalyticsPage() {
  const analytics = getAnalytics();

  // Process usage over time (last 7 days)
  const usageByDay = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split("T")[0];
    const dayLogs = mockUsageLogs.filter((log) =>
      log.timestamp.startsWith(dateStr),
    );
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      requests: dayLogs.length,
      successful: dayLogs.filter((l) => l.statusCode === 200).length,
      failed: dayLogs.filter((l) => l.statusCode !== 200).length,
    };
  });

  // Latency distribution
  const latencyBuckets = {
    "0-100ms": mockUsageLogs.filter((l) => l.latency < 100).length,
    "100-200ms": mockUsageLogs.filter(
      (l) => l.latency >= 100 && l.latency < 200,
    ).length,
    "200-300ms": mockUsageLogs.filter(
      (l) => l.latency >= 200 && l.latency < 300,
    ).length,
    "300-400ms": mockUsageLogs.filter(
      (l) => l.latency >= 300 && l.latency < 400,
    ).length,
    "400ms+": mockUsageLogs.filter((l) => l.latency >= 400).length,
  };

  const latencyData = Object.entries(latencyBuckets).map(([range, count]) => ({
    range,
    count,
  }));

  // Geographic distribution
  const geoData = Object.entries(analytics.countryCounts)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 5)
    .map(([country, count]) => ({
      name: country,
      value: count,
    }));

  const colors = ["#4facfe", "#00f2fe", "#43e97b", "#fa709a", "#fee140"];

  // Status codes
  const statusData = [
    {
      name: "Success (200)",
      value: analytics.successfulRequests,
      fill: "#4facfe",
    },
    {
      name: "Errors",
      value: analytics.failedRequests,
      fill: "#fa709a",
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Analytics</h1>
          <p className="text-muted-foreground">
            Detailed insights into your API usage and performance
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">
              {analytics.totalRequests.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">
              {analytics.successRate}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {analytics.successfulRequests} successful
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Latency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">
              {analytics.averageLatency}ms
            </div>
            <p className="text-xs text-muted-foreground mt-1">Response time</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cost This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">$129.50</div>
            <p className="text-xs text-muted-foreground mt-1">Based on usage</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Over Time */}
        <Card className="lg:col-span-2 bg-card/50 backdrop-blur border-border">
          <CardHeader>
            <CardTitle>API Usage Trend</CardTitle>
            <CardDescription>
              Request volume over the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={usageByDay}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(23, 23, 23, 0.9)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="requests"
                  stroke="#4facfe"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="successful"
                  stroke="#43e97b"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader>
            <CardTitle>Response Status</CardTitle>
            <CardDescription>Success vs error breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(23, 23, 23, 0.9)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Latency Distribution */}
        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader>
            <CardTitle>Latency Distribution</CardTitle>
            <CardDescription>Response time breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={latencyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis dataKey="range" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(23, 23, 23, 0.9)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                />
                <Bar dataKey="count" fill="#4facfe" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
            <CardDescription>Top regions by request volume</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={geoData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis type="number" stroke="rgba(255,255,255,0.5)" />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="rgba(255,255,255,0.5)"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(23, 23, 23, 0.9)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                />
                <Bar dataKey="value" fill="#4facfe" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Merchants */}
      <Card className="bg-card/50 backdrop-blur border-border">
        <CardHeader>
          <CardTitle>Top Merchants</CardTitle>
          <CardDescription>Most requested merchants by volume</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(analytics.merchantCounts)
              .sort(([, a], [, b]) => (b as number) - (a as number))
              .slice(0, 10)
              .map(([merchant, count], index) => (
                <div
                  key={merchant}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground text-sm font-medium w-6">
                      {index + 1}
                    </span>
                    <span className="text-foreground font-medium">
                      {merchant}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-40 bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-accent h-full rounded-full transition-all"
                        style={{
                          width: `${((count as number) / (Object.values(analytics.merchantCounts)[0] as number)) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-muted-foreground text-sm min-w-12 text-right">
                      {count} calls
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
