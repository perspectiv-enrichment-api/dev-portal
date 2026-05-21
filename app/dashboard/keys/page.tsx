"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { keysApi, type ApiKey } from "@/lib/api";
import { authStore } from "@/lib/auth-store";
import { useDashboard } from "@/app/dashboard/dashboard-context";
import { CheckCircle2, Copy, Plus, Trash2 } from "lucide-react";

export default function APIKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newKeyLabel, setNewKeyLabel] = useState("");
  const [projectId, setProjectId] = useState("");
  const [generatedKey, setGeneratedKey] = useState("");
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const { projects } = useDashboard();

  const fetchKeys = async () => {
    try {
      const token = await authStore.token();
      const { keys: data } = await keysApi.list(token);
      setKeys(data);
    } catch {
      setError("Failed to load API keys");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleCreateKey = async () => {
    if (!newKeyLabel.trim() || !projectId) return;
    setCreating(true);
    try {
      const token = await authStore.token();
      const { key } = await keysApi.create(
        token,
        newKeyLabel.trim(),
        projectId,
      );
      setGeneratedKey(key.key!);
      setKeys((prev) => [key, ...prev]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create key");
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async (keyId: string) => {
    try {
      const token = await authStore.token();
      await keysApi.revoke(token, keyId);
      setKeys((prev) =>
        prev.map((k) => (k.id === keyId ? { ...k, revoked: true } : k)),
      );
    } catch {
      setError("Failed to revoke key");
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (text === generatedKey) {
      handleCloseDialog();
    }
  };

  const handleCloseDialog = () => {
    setCreateDialogOpen(false);
    setNewKeyLabel("");
    setProjectId("");
    setGeneratedKey("");
    setCopied(false);
  };

  useEffect(() => {
    if (!createDialogOpen || projectId || !projects.length) return;
    setProjectId(projects[0].id);
  }, [createDialogOpen, projectId, projects]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">API Keys</h1>
          <p className="text-muted-foreground">
            Manage your API credentials and access tokens
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create New Key
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>
                Enter a label for your new API key
              </DialogDescription>
            </DialogHeader>
            {!generatedKey ? (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="keyProject">Project</Label>
                  <Select value={projectId} onValueChange={setProjectId}>
                    <SelectTrigger id="keyProject">
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!projects.length && (
                    <p className="text-xs text-muted-foreground">
                      Create a project first to generate an API key.
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="keyLabel">Key Label</Label>
                  <Input
                    id="keyLabel"
                    placeholder="e.g., Production API Key"
                    value={newKeyLabel}
                    onChange={(e) => setNewKeyLabel(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreateKey();
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4 py-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-600 mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="font-medium">API Key Generated</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Copy this key now. You will not be able to see it again.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Your API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      value={generatedKey}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleCopy(generatedKey)}
                      className={copied ? "text-green-600" : "hover:bg-muted"}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              {!generatedKey ? (
                <>
                  <Button variant="outline" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateKey}
                    disabled={!newKeyLabel.trim() || !projectId || creating}
                  >
                    {creating ? "Generating…" : "Generate Key"}
                  </Button>
                </>
              ) : (
                <Button onClick={handleCloseDialog}>Done</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 animate-pulse bg-muted rounded-lg" />
          ))}
        </div>
      ) : keys.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No API keys yet. Create one to get started.
        </p>
      ) : (
        <div className="space-y-4">
          {keys.map((apiKey) => (
            <Card
              key={apiKey.id}
              className={`bg-card/50 backdrop-blur border-border ${apiKey.revoked ? "opacity-60" : ""}`}
            >
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-foreground">
                          {apiKey.label}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            !apiKey.revoked
                              ? "bg-green-500/10 text-green-500"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {apiKey.revoked ? "Revoked" : "Active"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Created{" "}
                        {new Date(apiKey.created_at).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" },
                        )}
                      </p>
                      {apiKey.project_name && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Project: {apiKey.project_name}
                          {apiKey.project_environment
                            ? ` (${apiKey.project_environment})`
                            : ""}
                        </p>
                      )}
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      {apiKey.last_used_at
                        ? `Last used ${new Date(apiKey.last_used_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                        : "Never used"}
                    </div>
                  </div>

                  <div className="bg-background/50 border border-border rounded-lg p-4 flex items-center justify-between gap-4">
                    <span className="font-mono text-sm text-muted-foreground">
                      {apiKey.key_prefix}••••••••••••••••
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(apiKey.key_prefix)}
                      className="text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>

                  {!apiKey.revoked && (
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleRevoke(apiKey.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Revoke
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="bg-card/50 backdrop-blur border-border">
        <CardHeader>
          <CardTitle>How to use your API key</CardTitle>
          <CardDescription>
            Example request to the merchant enrichment endpoint
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-background/50 border border-border rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-muted-foreground font-mono whitespace-pre-wrap break-words">
              {`curl -X POST https://api.perspectiv.com/enrich \\
  -H "Authorization: Bearer <your-api-key>" \\
  -H "Content-Type: application/json" \\
  -d '{"merchant_name": "Amazon"}'`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
