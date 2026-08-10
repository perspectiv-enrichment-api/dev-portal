"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  keysApi,
  usageApi,
  type ApiKey,
  type UsageRecord,
  type UsageSummary,
} from "@/lib/api";
import { authStore } from "@/lib/auth-store";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const HISTORY_PAGE_SIZE = 20;

const ALL_KEYS = "all";

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<UsageSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Call history
  const [logs, setLogs] = useState<UsageRecord[]>([]);
  const [logTotal, setLogTotal] = useState(0);
  const [logsLoading, setLogsLoading] = useState(true);
  const [logsError, setLogsError] = useState("");
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [keyId, setKeyId] = useState(ALL_KEYS);
  const [logPage, setLogPage] = useState(1);

  useEffect(() => {
    authStore.token()
      .then((token) => usageApi.summary(token))
      .then(setSummary)
      .catch(() => setError("Failed to load analytics"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    authStore.token()
      .then((token) => keysApi.list(token))
      .then((res) => setKeys(res.keys))
      .catch(() => setKeys([]));
  }, []);

  const fetchLogs = useCallback(async () => {
    setLogsLoading(true);
    setLogsError("");
    try {
      const token = await authStore.token();
      const res = await usageApi.list(token, {
        page: logPage,
        limit: HISTORY_PAGE_SIZE,
        ...(from ? { from } : {}),
        ...(to ? { to } : {}),
        ...(keyId !== ALL_KEYS ? { key_id: keyId } : {}),
      });
      setLogs(res.logs ?? []);
      setLogTotal(res.total ?? 0);
    } catch (err: unknown) {
      setLogs([]);
      setLogTotal(0);
      setLogsError(
        err instanceof Error ? err.message : "Failed to load call history",
      );
    } finally {
      setLogsLoading(false);
    }
  }, [logPage, from, to, keyId]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const logTotalPages = Math.max(1, Math.ceil(logTotal / HISTORY_PAGE_SIZE));

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-4">
        {[1, 2, 3].map((i) => <div key={i} className="h-32 animate-pulse bg-muted rounded-lg" />)}
      </div>
    );
  }

  if (error || !summary) {
    return <div className="p-6 text-destructive text-sm">{error || "No data"}</div>;
  }

  const successRate = summary.total_calls > 0
    ? ((summary.match_rate) * 100).toFixed(2)
    : "0.00";

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Analytics</h1>
          <p className="text-muted-foreground">Detailed insights into your API usage and performance</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{summary.total_calls.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Match Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{successRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">Successful enrichments</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Latency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{summary.avg_latency}ms</div>
            <p className="text-xs text-muted-foreground mt-1">Response time</p>
          </CardContent>
        </Card>
      </div>

      {summary.daily_volume.length > 0 && (
        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader>
            <CardTitle>Daily Volume</CardTitle>
            <CardDescription>Request volume over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={summary.daily_volume}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(23, 23, 23, 0.9)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                />
                <Line type="monotone" dataKey="count" stroke="#4facfe" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Call history */}
      <Card className="bg-card/50 backdrop-blur border-border">
        <CardHeader>
          <CardTitle>Call History</CardTitle>
          <CardDescription>Individual enrichment requests</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                From
              </label>
              <Input
                type="date"
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  setLogPage(1);
                }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                To
              </label>
              <Input
                type="date"
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                  setLogPage(1);
                }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                API key
              </label>
              <Select
                value={keyId}
                onValueChange={(v) => {
                  setKeyId(v);
                  setLogPage(1);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_KEYS}>All keys</SelectItem>
                  {keys.map((k) => (
                    <SelectItem key={k.id} value={k.id}>
                      {k.label} ({k.key_prefix}…)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Time</TableHead>
                  <TableHead className="text-xs">Merchant</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">Latency</TableHead>
                  <TableHead className="text-xs">Country</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(log.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {log.merchant_name || "—"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "text-xs font-medium px-2 py-0.5 rounded",
                          log.status_code >= 200 && log.status_code < 300
                            ? "text-emerald-600 bg-emerald-50"
                            : "text-destructive bg-destructive/10",
                        )}
                      >
                        {log.status_code}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {log.latency_ms}ms
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {log.country || "—"}
                    </TableCell>
                  </TableRow>
                ))}
                {logs.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-10 text-center text-sm text-muted-foreground"
                    >
                      {logsLoading
                        ? "Loading…"
                        : logsError || "No calls in this range"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={logPage <= 1 || logsLoading}
                  onClick={() => setLogPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={logPage >= logTotalPages || logsLoading}
                  onClick={() => setLogPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
              <span className="text-xs text-muted-foreground font-semibold">
                Page {logPage} of {logTotalPages}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
